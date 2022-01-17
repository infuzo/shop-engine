using ShopEngine.Models;
using System;
using Xunit;

namespace ShopEngine.Tests
{
    public class OrderModelTest
    {
        [Fact]
        public void CheckStateCasting()
        {
            var model = new OrderModel();

            model.State = OrderModel.OrderStateType.Returned;

            Assert.True(model.State == OrderModel.OrderStateType.Returned);
        }

        [Fact]
        public void CheckLogChangesEntries()
        {
            var model = new OrderModel();

            var firstDateTime = DateTime.Now;
            model.AddStateLogEntry(OrderModel.OrderStateType.Paid, firstDateTime);

            var changes = model.GetLogStatesChanges();

            Assert.True(changes.Count == 1);
            Assert.True(changes[0].Key == OrderModel.OrderStateType.Paid);
            Assert.True(changes[0].Value == firstDateTime);

            var secondDateTime = firstDateTime.AddDays(1);
            model.AddStateLogEntry(OrderModel.OrderStateType.MakingUp, secondDateTime);

            changes = model.GetLogStatesChanges();

            Assert.True(changes.Count == 2);
            Assert.True(changes[0].Key == OrderModel.OrderStateType.Paid);
            Assert.True(changes[0].Value == firstDateTime);
            Assert.True(changes[1].Key == OrderModel.OrderStateType.MakingUp);
            Assert.True(changes[1].Value == secondDateTime);
        }

        [Fact]
        public void CheckProductsList()
        {
            var model = new OrderModel();

            var firstProduct = new OrderModel.ProductOrderInfo
            {
                Guid = Guid.NewGuid(),
                Price = 1000,
                Quantity = 2
            };

            model.AddProductToList(firstProduct);

            var productsList = model.GetProductsList();

            Assert.True(productsList.Count == 1);
            Assert.True(productsList[0].Guid == firstProduct.Guid);
            Assert.True(productsList[0].Price == firstProduct.Price);
            Assert.True(productsList[0].Quantity == firstProduct.Quantity);

            var secondProduct = new OrderModel.ProductOrderInfo
            {
                Guid = Guid.NewGuid(),
                Price = 1750,
                Quantity = 9
            };

            model.AddProductToList(secondProduct);

            productsList = model.GetProductsList();

            Assert.True(productsList.Count == 2);
            Assert.True(productsList[0].Guid == firstProduct.Guid);
            Assert.True(productsList[0].Price == firstProduct.Price);
            Assert.True(productsList[0].Quantity == firstProduct.Quantity);
            Assert.True(productsList[1].Guid == secondProduct.Guid);
            Assert.True(productsList[1].Price == secondProduct.Price);
            Assert.True(productsList[1].Quantity == secondProduct.Quantity);
        }
    }
}
