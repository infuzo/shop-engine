using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text;

namespace ShopEngine.Helpers
{
    public static class ModelErrorHelper
    {
        public static string GetModelErrors(ModelStateDictionary modelState)
        {
            StringBuilder message = new StringBuilder("There are errors in the model.\n");
            foreach (var error in modelState)
            {
                if (error.Value.Errors.Count > 0)
                {
                    message.Append(error.Key + ": ");
                    foreach (var errorMessage in error.Value.Errors)
                    {
                        message.Append(errorMessage.ErrorMessage + "; ");
                    }
                    message.AppendLine();
                }
            }
            return message.ToString();
        }
    }
}
