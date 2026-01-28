export interface LegalSection {
    title: string;
    content: string;
}

export interface LegalContent {
    title: string;
    intro: string;
    sections: LegalSection[];
}
