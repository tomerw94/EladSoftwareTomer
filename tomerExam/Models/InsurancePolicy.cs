using System.ComponentModel.DataAnnotations;

namespace tomerExam.Models
{
    public class InsurancePolicy
    {
        [Key, Required]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string PolicyNumber { get; set; }
        [Required, Range(0, int.MaxValue)]
        public int InsuranceAmount { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
