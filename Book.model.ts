export interface Book {
    authorName: string;
    chapters: Chapter[];
    genre: string;
    id: string;
    isbn: string;
    pubYear: string;
    tags: Tag[];
    title: string;
    totalPages: number;
}

export interface Chapter {
    title: string;
    pageCount: number;
}

export interface Tag {
    text: string;
}