using Domain.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ICheckBoxService
    {

        public Task<IEnumerable<CheckBoxViewModel<int>>> GetCategoryCheckBoxesAsync();
        public Task<IEnumerable<CheckBoxViewModel<string>>> GetStatusCheckBoxesAsync();
    }
}
