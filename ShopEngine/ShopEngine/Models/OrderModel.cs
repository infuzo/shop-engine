using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ShopEngine.Models
{
    public class OrderModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public int Number { get; set; }
        [Required]
        public int StateNumber { get; set; }
        public string LogStatesChangesJson { get; set; }
        [Required]
        public string CustomerPhoneNumber { get; set; }
        public string CustomerEmail { get; set; }
        [Required]
        public string ProductsJson { get; set; }

        public OrderStateType State
        {
            get => (OrderStateType)StateNumber;
            set => StateNumber = (int)value;
        }

        public IReadOnlyList<KeyValuePair<OrderStateType, DateTime>> GetLogStatesChanges()
        {
            var result = new List<KeyValuePair<OrderStateType, DateTime>>();

            if (!string.IsNullOrEmpty(LogStatesChangesJson))
            {
                var jsonObject = JsonSerializer.Deserialize<StatesChangesJson>(LogStatesChangesJson);
                for(int index = 0; index < jsonObject.keys.Length; index++)
                {
                    var parsedDate = DateTime.ParseExact(jsonObject.dates[index],
                        "dd/MM/yyyy HH:mm:ss.ffffff", CultureInfo.InvariantCulture);
                    result.Add(new KeyValuePair<OrderStateType, DateTime>(
                        (OrderStateType)jsonObject.keys[index], parsedDate));
                }
            }

            return result;
        }

        public void AddStateLogEntry(OrderStateType state, DateTime time)
        {
            StatesChangesJson jsonObject = new StatesChangesJson();
            if (!string.IsNullOrEmpty(LogStatesChangesJson))
            {
                jsonObject = JsonSerializer.Deserialize<StatesChangesJson>(LogStatesChangesJson);
            }
            jsonObject.keys = jsonObject.keys.Append((int)state).ToArray();
            jsonObject.dates = jsonObject.dates.Append(time.ToString("dd/MM/yyyy HH:mm:ss.ffffff", CultureInfo.InvariantCulture)).ToArray();

            LogStatesChangesJson = JsonSerializer.Serialize(jsonObject);
        }

        public IReadOnlyList<ProductOrderInfo> GetProductsList()
        {
            var result = new List<ProductOrderInfo>();

            if (!string.IsNullOrEmpty(ProductsJson))
            {
                var jsonObject = JsonSerializer.Deserialize<ProductsListJson>(ProductsJson);
                for (int index = 0; index < jsonObject.productsIds.Length; index++)
                {
                    result.Add(new ProductOrderInfo
                    {
                        Guid = Guid.Parse(jsonObject.productsIds[index]),
                        Quantity = jsonObject.productsQuantity[index],
                        Price = jsonObject.productsPrice[index]
                    });
                }
            }

            return result;
        }

        public void AddProductToList(ProductOrderInfo product)
        {
            var jsonObject = new ProductsListJson();

            if(!string.IsNullOrEmpty(ProductsJson))
            {
                jsonObject = JsonSerializer.Deserialize<ProductsListJson>(ProductsJson);
            }
            jsonObject.productsIds = jsonObject.productsIds.Append(product.Guid.ToString()).ToArray();
            jsonObject.productsQuantity = jsonObject.productsQuantity.Append(product.Quantity).ToArray();
            jsonObject.productsPrice = jsonObject.productsPrice.Append(product.Price).ToArray();

            ProductsJson = JsonSerializer.Serialize(jsonObject);
        }

        public enum OrderStateType
        {
            New,
            Paid,
            MakingUp,
            Sent,
            Received,
            Returned,
            Canceled
        }

        public class StatesChangesJson
        {
            public int[] keys { get; set; } = { };
            public string[] dates { get; set; } = { };
        }

        public class ProductsListJson 
        {
            public string[] productsIds { get; set; } = { };
            public int[] productsQuantity { get; set; } = { };
            public double[] productsPrice { get; set; } = { };
        }

        public class ProductOrderInfo
        {
            public Guid Guid { get; set; }
            public int Quantity { get; set; }
            public double Price { get; set; }
        }
    }
}
