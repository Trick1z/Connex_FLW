using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.Exceptions
{
    public class ValidateException : Exception
    {

        public Dictionary<string, List<string>> Messages { get; }

        public bool IsThrow { get; private set; }

        public ValidateException(Dictionary<string, List<string>> errors)
            : base("Validation failed")
        {
            Messages = errors ?? new Dictionary<string, List<string>>();
            IsThrow = true;
        }

        public ValidateException()
            : base("Validation failed")
        {
            Messages = new Dictionary<string, List<string>>();
            IsThrow = true;
        }



        public void Add(string elementId, string message)
        {
            if (!Messages.ContainsKey(elementId))
            {
                Messages[elementId] = new List<string>();
            }

            Messages[elementId].Add(message);
        }


        public void Throw()
        {
            if (Messages.Count == 0)
                return;
            else
            {
                IsThrow = true;
                throw this;
            }
        }

        public void Dispose()
        {
            bool throwFromInside = Marshal.GetExceptionPointers() != IntPtr.Zero;

            if (Messages.Count == 0 || IsThrow || throwFromInside)
                return;

            throw this;
        }
    }

    public class ExceptionViewModel
    {
        public string ElementId { get; set; }
        public List<string> Message { get; set; }
    }




}

