using EmployeeManagement.DataRepo;
using EmployeeManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly AppDBContext dbContext;
        public HomeController(AppDBContext _dbcontext)
        {
            dbContext = _dbcontext;
        }

        [HttpGet("getbooks")]
        public IActionResult getbooks()
        {
            var bookslist = dbContext.Books.Include(e => e.Tags).Include(e => e.Chapters).ToList();

            return Ok(bookslist);
        }

        [HttpPost("addbook")]
        public IActionResult addBook(Book book)
        {
            dbContext.Books.Add(book);

            dbContext.SaveChanges();

            return Ok(book);
        }

        [HttpPut("editbook")]
        public IActionResult editBook(Guid id, Book book)
        {
            var _book = dbContext.Books
                .Include(b => b.Tags)
                .Include(b => b.Chapters)
                .FirstOrDefault(x => x.Id == id);

            if (_book == null)
            {
                return NotFound();
            }

            _book.Title = book.Title;
            _book.AuthorName = book.AuthorName;
            _book.Genre = book.Genre;
            _book.Isbn = book.Isbn;

            var tagsToRemove = _book.Tags.Where(existingTag => !book.Tags.Any(updatedTag => updatedTag.Id == existingTag.Id)).ToList();
            foreach (var tag in tagsToRemove)
            {
                _book.Tags.Remove(tag);
            }

            foreach (var tag in book.Tags)
            {
                var existingTag = _book.Tags.FirstOrDefault(t => t.Id == tag.Id);
                if (existingTag != null)
                {
                    existingTag.Text = tag.Text;
                }
                else
                {
                    _book.Tags.Add(tag);
                }
            }

            var chaptersToRemove = _book.Chapters.Where(existingChapter => !book.Chapters.Any(updatedChapter => updatedChapter.Id == existingChapter.Id)).ToList();
            foreach (var chapter in chaptersToRemove)
            {
                _book.Chapters.Remove(chapter);
            }

            foreach (var chapter in book.Chapters)
            {
                var existingChapter = _book.Chapters.FirstOrDefault(c => c.Id == chapter.Id);
                if (existingChapter != null)
                {
                    existingChapter.Title = chapter.Title;
                    existingChapter.PageCount = chapter.PageCount;
                }
                else
                {
                    _book.Chapters.Add(chapter);
                }
            }

            dbContext.Books.Update(_book);
            dbContext.SaveChanges();

            return Ok(_book);
        }


        [HttpDelete("deletebook")]
        public IActionResult deletebook(Guid id)
        {
            var book = dbContext.Books.FirstOrDefault(e => e.Id == id);

            if (book == null)
            {
                return BadRequest("Null found");
            }

            dbContext.Books.Remove(book);

            dbContext.SaveChanges();

            return Ok(book);
        }

        [HttpGet("searchbooks")]
        public IActionResult SearchBooks(string searchTerm)
        {
            var books = dbContext.Books.Where(e =>
                e.Title.Contains(searchTerm) ||
                e.AuthorName.Contains(searchTerm) ||
                e.Isbn.Contains(searchTerm))
                .ToList();

            if (books.Count == 0)
            {
                return NotFound();
            }

            return Ok(books);
        }

    }
}