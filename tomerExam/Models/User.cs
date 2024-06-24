using System.ComponentModel.DataAnnotations;

namespace tomerExam.Models
{
    public class User
    {
        [Key, Required]
        public int Id { get; set; }
        [Required, EmailAddress, MaxLength(50)]
        public string Email { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; }
        public ICollection<InsurancePolicy> InsurancePolicies { get; set; }
    }
}
