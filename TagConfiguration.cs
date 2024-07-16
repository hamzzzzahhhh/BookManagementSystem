using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Text).IsRequired();

        builder.HasOne(e => e.Book).WithMany(e => e.Tags).HasForeignKey(e => e.BookId);
    }
}
