using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.AuthorName).IsRequired();
        builder.Property(e => e.PubYear).IsRequired();
        builder.Property(e => e.Isbn).IsRequired();
        builder.Property(e => e.Genre).IsRequired();
    }
}
