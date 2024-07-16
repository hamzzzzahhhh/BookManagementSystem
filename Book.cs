using EmployeeManagement.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Book
{
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string AuthorName { get; set; }

    [Required]
    public string PubYear { get; set; }

    [Required]
    public string Isbn { get; set; }

    [Required]
    public string Genre { get; set; }

    public List<Tag> Tags { get; set; }

    public List<Chapter> Chapters { get; set; }

    public int TotalPages { get; set; }
}
