using Microsoft.EntityFrameworkCore;
using tomerExam.Models;

namespace tomerExam.Dal
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<InsurancePolicy> InsurancePolicies { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<InsurancePolicy>()
                .HasOne<User>(ip => ip.User)           
                .WithMany(u => u.InsurancePolicies)
                .HasForeignKey(ip => ip.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
