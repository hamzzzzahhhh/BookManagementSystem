using System;
public class Tag
{
    public Guid Id { get; set; }

    public string Text { get; set; }

    public Guid BookId { get; set; }

    public Book? Book { get; set; }
}
