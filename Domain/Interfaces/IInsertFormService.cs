using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IInsertFormService

    {
        public Task<int> CreateFormAsync(InsertFormViewModel model);


    }
}
