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
        public int State { get; set; }
        public string LogStatesChangesJson { get; set; }
        [Required]
        public string CustomerPhoneNumber { get; set; }
        public string CustomerEmail { get; set; }
        [Required]
        public string ProductsJson { get; set; }

        public OrderStateType GetState()
        {
            return (OrderStateType)State;
        }

        public IReadOnlyList<KeyValuePair<OrderStateType, DateTime>> GetLogStatesChanges()
        {
            var result = new List<KeyValuePair<OrderStateType, DateTime>>();

            if (!string.IsNullOrEmpty(LogStatesChangesJson))
            {
                var jsonObject = JsonSerializer.Deserialize<StatesChangesJson>(LogStatesChangesJson);
                for(int index = 0; index < jsonObject.Keys.Length; index++)
                {
                    var parsedDate = DateTime.ParseExact(jsonObject.Dates[index],
                        "dd/MM/yyyy HH:mm:ss.ffffff", CultureInfo.InvariantCulture);
                    result.Add(new KeyValuePair<OrderStateType, DateTime>(
                        (OrderStateType)jsonObject.Keys[index], parsedDate));
                }
            }

            return result;
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
            public int[] Keys { get; set; }
            public string[] Dates { get; set; }
        }
    }
}
