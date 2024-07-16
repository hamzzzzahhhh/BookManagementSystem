using EmployeeManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagement.DataRepo
{
    public class ChapterConfiguration : IEntityTypeConfiguration<Chapter>
    {
        public ChapterConfiguration() { }

        public void Configure(EntityTypeBuilder<Chapter> builder)
        {
            builder.Property(e => e.Id).IsRequired();

            builder.HasOne(e => e.Book).WithMany(e => e.Chapters).HasForeignKey(e => e.BookId);

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Title).IsRequired().HasMaxLength(50);

            builder.HasIndex(e => e.PageCount).IsUnique();
        }
    }
}