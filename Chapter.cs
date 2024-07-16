using System.Reflection;

namespace EmployeeManagement.Models
{
    public class Chapter
    {
        public Guid Id { get; set; }
        public int? ChapterNumber { get; set; }

        public string Title { get; set; }

        public int PageCount { get; set; }

        public Guid BookId { get; set; }

        public Book? Book { get; set; }
    }
}