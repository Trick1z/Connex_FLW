////using FMS.Domain.Exceptions;
////using FMS.Domain.ViewModels;
//using Microsoft.AspNetCore.Diagnostics;
////using Newtonsoft.Json;
////using Newtonsoft.Json.Serialization;
//using System.Net;
//using Microsoft.Data.SqlClient;
//using Domain.Exceptions;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Serialization;
////using FMS.Domain.Extensions;
////using FMS.Domain.Interfaces;
//using Domain.Helper;

//namespace FMS.Server.Handlers
//{
//    public static class GlobalExceptionHandler
//    {
//        public static void UseGlobalExceptionHandler(this IApplicationBuilder app)
//        {
//            app.UseExceptionHandler(appError =>
//            {
//                appError.Run(async context =>
//                {
//                    if (context.Features.Get<IExceptionHandlerFeature>() != null)
//                    {
//                        var exception = context.Features.Get<IExceptionHandlerFeature>().Error;
//                        var result = new GlobalExceptionViewModel();

//                        if (exception is ValidateException)
//                        {

//                            result.IsValidation = true;
//                            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

//                            var validateEx = (ValidateException)exception;

//                            foreach (var exMsg in validateEx.Errors)  // ✅ แก้ Message → Errors
//                            {
//                                var error = new ExceptionViewModel
//                                {
//                                    ElementId = exMsg.ElementId,
//                                    Message = exMsg.Message
//                                };

//                                result.Errors.Add(error);
//                            }

//                            //foreach (var exMsg in ((ValidateException)exception).Message)
//                            //{
//                            //    var error = new ExceptionViewModel();
//                            //    error.ElementId = exMsg.ElementId;
//                            //    error.Message = exMsg.Message;

//                            //    result.Errors.Add(error);
//                            //}
//                        }
//                        else
//                        {
//                            //result.IsValidation = false;
//                            //// app log

//                            //bool isSqlException = exception is SqlException;

//                            //// resolve deopendency with service locator
//                            //var ServiceLocator = app.Services.GetService<IServiceProvider>();

//                            //var appLogger = ServiceLocator.ServiceProvider.GetRequiredService<IAppLogger>();
//                            //var utils = ServiceLocator.ServiceProvider.GetRequiredService<IUtilsService>();

//                            //string errorCode = await appLogger.LogErrorAsync(exception, string.Empty, string.Empty);

//                            //context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
//                            //var error = new ExceptionViewModel();
//                            //if (isSqlException)
//                            //{
//                            //    error.Message = exception.AllMessages();
//                            //}
//                            //else
//                            //{
//                            //    error.Message = $"ErrorCode [{errorCode}]\r\n{exception.AllMessages()}";
//                            //}

//                            //result.Errors.Add(error);
//                            //result.IsValidation = false;
//                            //// app log

//                            //bool isSqlException = exception is SqlException;

//                            //// resolve deopendency with service locator
//                            //var appLogger = ServiceLocator.ServiceProvider.GetRequiredService<IAppLogger>();
//                            //var utils = ServiceLocator.ServiceProvider.GetRequiredService<IUtilsService>();

//                            //string errorCode = await appLogger.LogErrorAsync(exception, string.Empty, string.Empty);

//                            //context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
//                            //var error = new ExceptionViewModel();
//                            //if (isSqlException)
//                            //{
//                            //    error.Message = exception.AllMessages();
//                            //}
//                            //else
//                            //{
//                            //    error.Message = $"ErrorCode [{errorCode}]\r\n{exception.AllMessages()}";
//                            //}

//                            //result.Errors.Add(error);

//                        }

//                        context.Response.ContentType = "application/json";
//                        var jsonSerializerSettings = new JsonSerializerSettings
//                        {
//                            ContractResolver = new CamelCasePropertyNamesContractResolver()
//                        };

//                        await context.Response.WriteAsync(JsonConvert.SerializeObject(result, jsonSerializerSettings));
//                    }
//                });
//            });
//        }
//    }
//}


using Microsoft.AspNetCore.Diagnostics;
using System.Net;
using Microsoft.Data.SqlClient;
using Domain.Exceptions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Domain.Helper;

namespace FMS.Server.Handlers
{
    public static class GlobalExceptionHandler
    {
        public static void UseGlobalExceptionHandler(this IApplicationBuilder app)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        var exception = contextFeature.Error;
                        var result = new GlobalExceptionViewModel();
                        context.Response.ContentType = "application/json";

                        if (exception is ValidateException validateEx)
                        {
                            var jsonSerializerSettings = new JsonSerializerSettings
                            {
                                ContractResolver = new CamelCasePropertyNamesContractResolver()
                            };

                            //result.IsValidation = true;
                            result.Messages = validateEx.Messages;

                            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                            var json = JsonConvert.SerializeObject(result, jsonSerializerSettings);
                            await context.Response.WriteAsync(json);

                        }
                        else
                        {
                            var jsonSerializerSettings = new JsonSerializerSettings
                            {
                                ContractResolver = new CamelCasePropertyNamesContractResolver()
                            };

                            //result.IsValidation = true;
                            //result.Messages = validateEx.Messages;

                            result.Messages = new Dictionary<string, List<string>>();

                            var error = new List<string>();

                            error.Add(exception.Message);

                            result.Messages.Add("System", error );

                            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                            //var error = new ExceptionViewModel
                            //{
                            //    //Message = exception.Message
                            //};

                            //result.Errors.Add(error);


                            var json = JsonConvert.SerializeObject(result, jsonSerializerSettings);
                            await context.Response.WriteAsync(json);
                        }

                    }
                });
            });
        }
    }
}
