using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Helper
{
    public static class ServiceLocator
    {
        public static IServiceProvider ServiceProvider { get; set; }
    }
}