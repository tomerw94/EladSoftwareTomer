using System.ComponentModel.DataAnnotations;

namespace tomerExam.Models.Dto
{
    public class InsurancePolicyDto
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; }
        public int InsuranceAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; }
    }
}
