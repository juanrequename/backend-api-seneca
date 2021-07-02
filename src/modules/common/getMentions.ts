export function getMentions(text: string): string[]{
    const mentionsRegex = new RegExp('[＠@]([a-zA-Z0-9\_\-]+)', 'gim');
    let matches = text.match(mentionsRegex);
    if (matches && matches.length) {
        matches = matches.map(match => match.slice(1));
        return [...new Set(matches)]
    } else {
        return [];
    }
}