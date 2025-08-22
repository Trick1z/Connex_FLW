using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class ClaimsService : IClaimsService
    {

        private readonly IHttpContextAccessor _contextAccessor;

        public ClaimsService(IHttpContextAccessor httpContextAccessor)
        {
            _contextAccessor = httpContextAccessor;

        }


        public int GetCurrentUserId()
        {
            var user = _contextAccessor.HttpContext?.User;

            return int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        }


    }
}
