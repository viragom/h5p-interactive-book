/**
 * A component which helps in navigation
 * Constructor function.
 */
class SideBar extends H5P.EventDispatcher {
  constructor(config, contentId, parent) {
    super();
    this.id = contentId;
    this.parent = parent;
    this.div = document.createElement('div');
    this.div.classList.add('h5p-digibook-navigation');

    this.chapters = [];


    this.titleElem = this.addMainTitle(config.title);
    this.findAllChapters(config);

    this.chapterElems = this.getChapterElements();



    //Appending phase
    this.div.appendChild(this.titleElem.div);

    this.chapterElems.forEach(element => {
      this.div.appendChild(element);
    });



  }

  addMainTitle(title) {
    const div = document.createElement('div');
    const p = document.createElement('p');

    p.innerHTML = title;
    div.appendChild(p);
    return {
      div,
      p
    };
  }

  findAllChapters(config) {
    for (let i = 0; i < config.chapters.length; i++) {
      this.chapters.push(config.chapters[i]);
    }
  }

  toggleChapterShow(element) {

    const x = element.target.nextSibling;
    if (x.style.display === "none") {
      x.style.display = "grid";
    } 
    else {
      x.style.display = "none";
    }
  }

  createElemFromChapter(chapter, chapterIndex) {
    const that = this;

    //Initialize elements
    const chapterDiv = document.createElement('div');
    const sectionsDiv = document.createElement('div');
    const title = document.createElement('p');

    //Add classes
    title.classList.add('h5p-digibook-navigation-chapter-title');
    chapterDiv.classList.add('h5p-digibook-navigation-chapter');
    sectionsDiv.classList.add('h5p-digibook-navigation-sections');

    
    title.innerHTML = chapter.chapter_title;
    chapterDiv.appendChild(title);

    title.onclick = (event) => {
      this.toggleChapterShow(event);
    };

    // Add sections to the chapter
    const sections = chapter.chapter.params.content;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      const p = document.createElement('button');
      p.innerHTML = this.parseLibrary(section.content);
      
      sectionsDiv.appendChild(p);
      
      p.onclick = () => {
        that.parent.trigger('newChapter', {
          h5pbookid: that.parent.contentId,
          chapter: chapterIndex,
          section: i
        });
      };
    }
    chapterDiv.appendChild(sectionsDiv);

    
    return {
      chapterDiv,
      sectionsDiv,
      sections
    };
  }

  getChapterElements() {
    let tmp = [];
    for (let i = 0; i < this.chapters.length; i++) {
      const chapter = this.chapters[i];      
      const elem = this.createElemFromChapter(chapter, i);
      tmp.push(elem.chapterDiv);
    }
    return tmp;
  }


  /**
   * Parses the library which is used
   * TODO: Implement a more flexible system for library/title detection
   * @param {string} input 
   */
  parseLibrary(input) {
    let tmp;

    switch (input.library.split(" ")[0]) {

      case "H5P.AdvancedText":
        // Finds the first H2-element inside a text-document
        tmp = input.params.text.match(/<h2>(.+)<\/h2>/);
        if (tmp)
          tmp = tmp[1];
        else
          tmp = "Unnamed paragraph";
        break;

      case "H5P.Image":
        tmp = input.params.alt;
        break;
      default:
        tmp = input.library;
        break;
    }
    return tmp;
  }
}
export default SideBar;