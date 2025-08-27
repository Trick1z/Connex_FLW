using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public class Constance
    {
        public const int AdminId = 1;


    }

    public class IssueCategoriesId 
    { 
        public const int Borrow = 1;
        public const int Repair = 2;
        public const int Progream = 3;
    }

    public class DocumentStatus
    {
        public const string Draft = "Draft";
        public const string Submit = "Submit";
        public const string Done = "Done";
        public const string InProgress = "InProgress";
    }
    public class TaskStatus
    {
        public const string Assigned = "Assigned";
        public const string CancelAssigned = "Submit";
        public const string CancelCompleted = "Assigned";
        public const string CancelRejected = "Assigned";
        public const string Done = "Done";
        public const string Draft = "Draft";
        public const string Rejected = "Done";
        public const string Submit = "Submit";
    }
}
