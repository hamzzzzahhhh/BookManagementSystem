using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.DataRepo
{
    public class AppDBContext : DbContext
    {
        public DbSet<Book> Books {  get; set; }
        public DbSet<Tag> Tags{  get; set; }

        public DbSet<Chapter> Chapters{ get; set; }

        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new BookConfiguration());

            modelBuilder.ApplyConfiguration(new TagConfiguration());

            modelBuilder.ApplyConfiguration(new ChapterConfiguration());
        }
    }

}
