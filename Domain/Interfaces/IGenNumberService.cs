using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IGenNumberService
    {

        public Task<string> GenDocNo(string prefix, int delay = 0);


    }
}
