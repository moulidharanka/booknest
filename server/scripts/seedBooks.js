require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const connectDB = require('../config/db');

// Helper to generate verified Gutenberg cover image URLs
const gutenbergCover = (id) => `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;

// 105+ Curated Public Domain Books with verified Gutenberg IDs and cover images
const publicDomainRaw = [
  // Literature & Romance Classics
  [1342, "Pride and Prejudice", "Jane Austen", ["Fiction", "Romance", "Classic"], 1813, "Elizabeth Bennet navigates manners, family, and the haughty Mr. Darcy in Austen's witty masterpiece."],
  [158, "Emma", "Jane Austen", ["Fiction", "Romance", "Classic"], 1815, "Emma Woodhouse prides herself on matchmaking in Highbury, only to blunder blindly through her own heart."],
  [105, "Persuasion", "Jane Austen", ["Fiction", "Romance", "Classic"], 1817, "Anne Elliot re-encounters Captain Wentworth years after being persuaded to break their engagement."],
  [161, "Sense and Sensibility", "Jane Austen", ["Fiction", "Romance", "Classic"], 1811, "The contrast between Elinor Dashwood's reasoned restraint and Marianne's unbridled romantic passion."],
  [121, "Northanger Abbey", "Jane Austen", ["Fiction", "Mystery", "Classic"], 1817, "Catherine Morland's overactive gothic novel imagination tangles with real-world courtship at Bath."],
  [1260, "Jane Eyre", "Charlotte Brontë", ["Fiction", "Romance", "Classic"], 1847, "An orphaned governess fights for equality and love amidst the dark, hidden secrets of Thornfield Hall."],
  [768, "Wuthering Heights", "Emily Brontë", ["Fiction", "Romance", "Classic"], 1847, "Heathcliff and Catherine Earnshaw's wild, destructive passion across the bleak Yorkshire moors."],
  [969, "The Tenant of Wildfell Hall", "Anne Brontë", ["Fiction", "Classic"], 1848, "A mysterious young widow flees an abusive aristocratic marriage in a revolutionary Victorian feminist novel."],
  [766, "David Copperfield", "Charles Dickens", ["Fiction", "Classic"], 1850, "Dickens' personal favorite novel chronicling David's life from impoverished childhood to mature author."],
  [98, "A Tale of Two Cities", "Charles Dickens", ["Historical", "Fiction", "Classic"], 1859, "Sydney Carton, Charles Darnay, and Lucie Manette entangled in London and Paris during the Reign of Terror."],
  [1400, "Great Expectations", "Charles Dickens", ["Fiction", "Historical", "Classic"], 1861, "The young blacksmith apprentice Pip receives unexpected wealth from an anonymous benefactor."],
  [730, "Oliver Twist", "Charles Dickens", ["Fiction", "Historical", "Classic"], 1838, "An orphaned workhouse boy is drawn into the London criminal underworld run by Fagin."],
  [46, "A Christmas Carol", "Charles Dickens", ["Fantasy", "Fiction", "Classic"], 1843, "Ebenezer Scrooge is visited by three ghosts to learn compassion and the true joy of Christmas."],
  [514, "Little Dorrit", "Charles Dickens", ["Fiction", "Classic"], 1857, "A satire on the Marshalsea debtors' prison, bureaucracy, and high Victorian commerce."],
  [883, "Our Mutual Friend", "Charles Dickens", ["Fiction", "Mystery", "Classic"], 1865, "A sophisticated mystery exploring the transformative and corrupting influence of money along the Thames."],
  [64317, "The Great Gatsby", "F. Scott Fitzgerald", ["Fiction", "Classic"], 1925, "The tragic obsession of millionaire Jay Gatsby for socialite Daisy Buchanan during the Jazz Age."],
  [4300, "Ulysses", "James Joyce", ["Fiction", "Classic"], 1922, "Leopold Bloom's epic single-day modernist wandering through the streets of Dublin on June 16, 1904."],
  [2814, "Dubliners", "James Joyce", ["Fiction", "Classic"], 1914, "Fifteen luminous vignettes capturing life, desire, and paralysis in early twentieth-century Ireland."],
  [4217, "A Portrait of the Artist as a Young Man", "James Joyce", ["Fiction", "Classic"], 1916, "Stephen Dedalus' intellectual and spiritual awakening as he rejects church and family to write."],
  [113, "The Secret Adversary", "Agatha Christie", ["Mystery", "Fiction", "Classic"], 1922, "Tommy and Tuppence launch the Young Adventurers Ltd. and uncover an international post-war conspiracy."],
  [863, "The Mysterious Affair at Styles", "Agatha Christie", ["Mystery", "Fiction", "Classic"], 1920, "The historic debut of the Belgian detective Hercule Poirot investigating a wealthy heiress's murder."],
  [1661, "The Adventures of Sherlock Holmes", "Arthur Conan Doyle", ["Mystery", "Fiction", "Classic"], 1892, "Sherlock Holmes and Dr. Watson apply pure deductive reasoning across twelve quintessential cases."],
  [2852, "The Hound of the Baskervilles", "Arthur Conan Doyle", ["Mystery", "Horror", "Classic"], 1902, "A ghostly phantom hound stalks the moors of Devonshire, threatening the Baskerville family line."],
  [244, "A Study in Scarlet", "Arthur Conan Doyle", ["Mystery", "Fiction", "Classic"], 1887, "The very first meeting of Sherlock Holmes and Dr. Watson leading into a revenge murder investigation."],
  [2097, "The Sign of the Four", "Arthur Conan Doyle", ["Mystery", "Adventure", "Classic"], 1890, "Mary Morstan seeks Holmes' help regarding stolen Agra treasure, four convicts, and a poisoned dart."],
  [834, "The Memoirs of Sherlock Holmes", "Arthur Conan Doyle", ["Mystery", "Fiction", "Classic"], 1894, "Eleven classic mysteries concluding in the fateful confrontation at Reichenbach Falls."],
  [174, "The Picture of Dorian Gray", "Oscar Wilde", ["Fiction", "Classic", "Philosophy"], 1890, "Dorian Gray remains forever youthful and unblemished while his secret portrait reflects his sins."],
  [844, "The Importance of Being Earnest", "Oscar Wilde", ["Fiction", "Classic"], 1895, "Jack Worthing and Algernon Moncrieff adopt fictitious personas to pursue love in high society."],
  [30254, "De Profundis", "Oscar Wilde", ["Non-Fiction", "Philosophy", "Classic"], 1905, "Wilde's poignant, deeply reflective letter penned while incarcerated inside Reading Gaol."],

  // Gothic, Horror & Dark Fantasy
  [84, "Frankenstein", "Mary Shelley", ["Fiction", "Horror", "Science Fiction"], 1818, "Victor Frankenstein infuses life into an engineered creature, provoking catastrophic vengeance."],
  [345, "Dracula", "Bram Stoker", ["Horror", "Fiction", "Classic"], 1897, "Count Dracula's nocturnal arrival from Transylvania to threaten Victorian London with the undead."],
  [43, "The Strange Case of Dr. Jekyll and Mr. Hyde", "Robert Louis Stevenson", ["Horror", "Mystery", "Classic"], 1886, "Dr. Jekyll brews a serum separating his refined gentleman identity from the sinister Mr. Hyde."],
  [1064, "The Masque of the Red Death", "Edgar Allan Poe", ["Horror", "Fiction", "Classic"], 1842, "Prince Prospero seals his abbey against a lethal plague, only for a spectral guest to penetrate."],
  [1065, "The Fall of the House of Usher", "Edgar Allan Poe", ["Horror", "Fiction", "Classic"], 1839, "A decaying family mansion mirrors the deteriorating sanity and dread of the reclusive Usher siblings."],
  [1063, "The Cask of Amontillado", "Edgar Allan Poe", ["Horror", "Mystery", "Classic"], 1846, "Montresor plots a chilling, meticulous subterranean revenge against Fortunato during Carnival."],
  [209, "The Turn of the Screw", "Henry James", ["Horror", "Mystery", "Classic"], 1898, "A governess at a quiet country estate becomes convinced that ghosts haunt the children in her care."],
  [696, "The Castle of Otranto", "Horace Walpole", ["Horror", "Fantasy", "Classic"], 1764, "The very first gothic novel, filled with ancient prophecies, haunted helmets, and subterranean terror."],
  [27827, "The King in Yellow", "Robert W. Chambers", ["Horror", "Fantasy", "Classic"], 1895, "Interconnected weird fiction tales centered on a forbidden play that drives all readers insane."],

  // Science Fiction & Speculative Classics
  [35, "The Time Machine", "H.G. Wells", ["Science Fiction", "Adventure", "Classic"], 1895, "A scientist builds a vehicle that carries him 800,000 years into the future of humanity."],
  [36, "The War of the Worlds", "H.G. Wells", ["Science Fiction", "Horror", "Classic"], 1898, "Ruthless Martian invaders assault Victorian England with devastating heat rays and black smoke."],
  [5230, "The Invisible Man", "H.G. Wells", ["Science Fiction", "Horror", "Classic"], 1897, "Griffin unlocks the secret of optical refraction, only to descend into isolation and madness."],
  [159, "The Island of Doctor Moreau", "H.G. Wells", ["Science Fiction", "Horror", "Classic"], 1896, "A castaway stumbles upon a sinister Pacific island where a vivisectionist turns beasts into men."],
  [164, "Twenty Thousand Leagues Under the Sea", "Jules Verne", ["Science Fiction", "Adventure", "Classic"], 1870, "Professor Aronnax journeys aboard Captain Nemo's technologically marvel submarine, the Nautilus."],
  [103, "Around the World in Eighty Days", "Jules Verne", ["Adventure", "Fiction", "Classic"], 1873, "Phileas Fogg bets twenty thousand pounds that he can travel around the globe in eighty days."],
  [18857, "Journey to the Center of the Earth", "Jules Verne", ["Science Fiction", "Adventure", "Classic"], 1864, "Professor Lidenbrock and Axel decipher runic parchment leading down into an Icelandic volcano."],
  [83, "From the Earth to the Moon", "Jules Verne", ["Science Fiction", "Adventure", "Classic"], 1865, "The Baltimore Gun Club builds a monumental cannon to launch three travelers to the lunar surface."],
  [5200, "The Metamorphosis", "Franz Kafka", ["Fiction", "Philosophy", "Classic"], 1915, "Gregor Samsa wakes up one morning from troubled dreams transformed into a monstrous insect."],
  [7849, "The Trial", "Franz Kafka", ["Fiction", "Philosophy", "Dystopian"], 1925, "Josef K. is abruptly arrested one morning without ever being informed of the nature of his crime."],
  [262, "Erewhon", "Samuel Butler", ["Science Fiction", "Philosophy", "Dystopian"], 1872, "A traveler discovers a satirical utopian realm where machines are feared and illness is punished."],
  [2148, "The Lost World", "Arthur Conan Doyle", ["Science Fiction", "Adventure", "Classic"], 1912, "Professor Challenger leads an Amazonian expedition to an isolated plateau of living dinosaurs."],

  // Epic Adventure & High Seas
  [2701, "Moby Dick", "Herman Melville", ["Adventure", "Fiction", "Classic"], 1851, "Captain Ahab steers the whaling ship Pequod into madness across the oceans after the Great White Whale."],
  [1184, "The Count of Monte Cristo", "Alexandre Dumas", ["Adventure", "Fiction", "Classic"], 1844, "Edmond Dantès escapes the Château d'If with vast treasure to execute a masterful revenge."],
  [1257, "The Three Musketeers", "Alexandre Dumas", ["Adventure", "Historical", "Classic"], 1844, "D'Artagnan joins Athos, Porthos, and Aramis to protect King and Queen against Cardinal Richelieu."],
  [120, "Treasure Island", "Robert Louis Stevenson", ["Adventure", "Children", "Classic"], 1883, "Young Jim Hawkins sets sail for Skeleton Island with a treasure map and the pirate Long John Silver."],
  [421, "Kidnapped", "Robert Louis Stevenson", ["Adventure", "Historical", "Classic"], 1886, "David Balfour is betrayed by his wicked uncle and cast into the Scottish Jacobite highlands."],
  [521, "Robinson Crusoe", "Daniel Defoe", ["Adventure", "Fiction", "Classic"], 1719, "A shipwrecked mariner spends twenty-eight resourceful years on an uninhabited desert island."],
  [219, "Heart of Darkness", "Joseph Conrad", ["Fiction", "Adventure", "Classic"], 1899, "Charles Marlow sails up the Congo River searching for the enigmatic, mad ivory trader Kurtz."],
  [974, "Lord Jim", "Joseph Conrad", ["Fiction", "Adventure", "Classic"], 1900, "A disgraced ship's officer spends a lifetime searching for redemption across the Malay archipelago."],
  [28054, "The Sea-Wolf", "Jack London", ["Adventure", "Fiction", "Classic"], 1904, "Humphrey Van Weyden is rescued by the tyrannical Captain Wolf Larsen aboard the seal-hunting schooner."],
  [215, "The Call of the Wild", "Jack London", ["Adventure", "Fiction", "Classic"], 1903, "Buck, a pampered dog from California, is abducted and thrust into the brutal Alaskan gold rush."],
  [910, "White Fang", "Jack London", ["Adventure", "Fiction", "Classic"], 1906, "A wild wolf-dog in the Yukon territory endures cruelty before finding loyalty with a compassionate master."],
  [60, "The Scarlet Pimpernel", "Baroness Orczy", ["Adventure", "Historical", "Romance"], 1905, "An elusive English aristocrat leads a secret league rescuing French nobles from the guillotine."],
  [216, "The Moonstone", "Wilkie Collins", ["Mystery", "Fiction", "Classic"], 1868, "Regarded as the first English detective novel, centered on the theft of an invaluable sacred diamond."],
  [583, "The Woman in White", "Wilkie Collins", ["Mystery", "Fiction", "Classic"], 1859, "Walter Hartright encounters a spectral woman clothed in white holding a desperate, dark secret."],

  // Philosophy, Thought & Stoic Wisdom
  [1497, "The Republic", "Plato", ["Philosophy", "Classic", "Non-Fiction"], 1901, "Socrates examines justice, the allegory of the cave, and the architecture of the ideal city-state."],
  [1656, "Apology, Crito, and Phaedo of Socrates", "Plato", ["Philosophy", "History", "Classic"], 1901, "The dramatic trial, imprisonment, and final philosophical discourse of Socrates before his execution."],
  [2680, "Meditations", "Marcus Aurelius", ["Philosophy", "Self-Help", "Classic"], 1906, "The private journal of the Roman Emperor on Stoic resilience, virtue, mortality, and inner peace."],
  [132, "The Art of War", "Sun Tzu", ["Philosophy", "Non-Fiction", "Classic"], 1910, "Thirteen foundational chapters on grand strategy, leadership, discipline, and deceptive tactics."],
  [1232, "The Prince", "Niccolò Machiavelli", ["Philosophy", "History", "Classic"], 1910, "A realistic, controversial sixteenth-century handbook on acquiring and retaining sovereign power."],
  [4363, "Beyond Good and Evil", "Friedrich Nietzsche", ["Philosophy", "Non-Fiction", "Classic"], 1907, "A searing critique of traditional morality, religion, and the foundations of European philosophy."],
  [1998, "Thus Spake Zarathustra", "Friedrich Nietzsche", ["Philosophy", "Fiction", "Classic"], 1885, "A poetic philosophical work introducing the Übermensch, eternal return, and the will to power."],
  [5683, "The Antichrist", "Friedrich Nietzsche", ["Philosophy", "Non-Fiction", "Classic"], 1918, "Nietzsche's polemical analysis of Christian theology and slave morality."],
  [10615, "Enchiridion", "Epictetus", ["Philosophy", "Self-Help", "Classic"], 1904, "A practical Stoic handbook teaching how to distinguish what is within our control from what is not."],
  [829, "Gulliver's Travels", "Jonathan Swift", ["Fantasy", "Fiction", "Classic"], 1726, "Lemuel Gulliver's satirical voyages to Lilliput, Brobdingnag, Laputa, and the land of the Houyhnhnms."],
  [3600, "Essays of Michel de Montaigne", "Michel de Montaigne", ["Philosophy", "Non-Fiction", "Classic"], 1877, "Intimate, pioneering essays reflecting on human nature, education, customs, and self-knowledge."],
  [2554, "Crime and Punishment", "Fyodor Dostoevsky", ["Fiction", "Philosophy", "Classic"], 1866, "Rodion Raskolnikov rationalizes the murder of an unscrupulous pawnbroker, then suffers inner torment."],
  [600, "Notes from the Underground", "Fyodor Dostoevsky", ["Fiction", "Philosophy", "Classic"], 1918, "The confessional diary of a bitter, isolated retired official living in St. Petersburg."],
  [28053, "The Brothers Karamazov", "Fyodor Dostoevsky", ["Fiction", "Philosophy", "Classic"], 1880, "A profound theological and psychological drama following three brothers and their father's murder."],
  [2600, "War and Peace", "Leo Tolstoy", ["Historical", "Fiction", "Classic"], 1869, "An epic tapestry of Russian society, romance, and philosophical inquiry during the Napoleonic wars."],
  [1399, "Anna Karenina", "Leo Tolstoy", ["Fiction", "Romance", "Classic"], 1877, "The tragic extramarital love affair of Anna Karenina set against the pastoral marriage of Levin."],
  [986, "The Death of Ivan Ilyich", "Leo Tolstoy", ["Fiction", "Philosophy", "Classic"], 1886, "A high-court judge confronts the spiritual emptiness of his comfortable, conventional life upon illness."],

  // Ancient Epics & Mythology
  [1727, "The Odyssey", "Homer", ["Adventure", "Fantasy", "Classic"], 1919, "Odysseus' perilous ten-year voyage back to Ithaca following the fall of Troy, battling monsters and gods."],
  [6130, "The Iliad", "Homer", ["Adventure", "Historical", "Classic"], 1898, "The wrath of Achilles and the brutal siege of Troy during the final weeks of the Trojan War."],
  [8800, "The Divine Comedy", "Dante Alighieri", ["Fantasy", "Philosophy", "Classic"], 1909, "Dante's spiritual pilgrimage guided by Virgil and Beatrice through Inferno, Purgatorio, and Paradiso."],
  [100, "The Complete Works of William Shakespeare", "William Shakespeare", ["Fiction", "Classic"], 1994, "The historic omnibus containing all 37 plays and sonnets from Hamlet to Romeo and Juliet."],
  [1524, "Hamlet", "William Shakespeare", ["Fiction", "Mystery", "Classic"], 1603, "The Prince of Denmark is commanded by his father's ghost to avenge his treacherous uncle Claudius."],
  [1533, "Macbeth", "William Shakespeare", ["Fiction", "Horror", "Classic"], 1606, "Scottish general Macbeth receives prophecies of kingship that ignite ruthless, bloody ambition."],
  [1513, "Romeo and Juliet", "William Shakespeare", ["Fiction", "Romance", "Classic"], 1597, "The immortal tragedy of star-crossed young lovers divided by their feuding families in Verona."],
  [2807, "The Song of Roland", "Anonymous", ["Historical", "Adventure", "Classic"], 1913, "The great medieval French chivalric epic recounting Charlemagne's rearguard battle at Roncevaux."],
  [16328, "Beowulf", "Anonymous", ["Fantasy", "Adventure", "Classic"], 1910, "The Geatish warrior Beowulf battles the monster Grendel, Grendel's mother, and a fire-breathing dragon."],

  // Children, Family & Enchanting Fables
  [11, "Alice's Adventures in Wonderland", "Lewis Carroll", ["Children", "Fantasy", "Classic"], 1865, "Alice tumbles down a rabbit hole into a fantastical, whimsical world of logic-defying inhabitants."],
  [12, "Through the Looking-Glass", "Lewis Carroll", ["Children", "Fantasy", "Classic"], 1871, "Alice steps through a mirror to enter a living chess game filled with Tweedledum and Tweedledee."],
  [16, "Peter Pan", "J.M. Barrie", ["Children", "Fantasy", "Classic"], 1911, "Peter Pan and Tinker Bell whisk the Darling children away to Neverland to battle Captain Hook."],
  [55, "The Wonderful Wizard of Oz", "L. Frank Baum", ["Children", "Fantasy", "Classic"], 1900, "Dorothy Gale and Toto are transported by a cyclone to the colorful, magical Land of Oz."],
  [236, "The Jungle Book", "Rudyard Kipling", ["Children", "Adventure", "Classic"], 1894, "Mowgli grows up among the wolf pack of Seoni under the mentorship of Baloo and Bagheera."],
  [37106, "Little Women", "Louisa May Alcott", ["Family", "Fiction", "Classic"], 1868, "Meg, Jo, Beth, and Amy March pursue creative dreams and family loyalty during the Civil War."],
  [48326, "The Secret Garden", "Frances Hodgson Burnett", ["Children", "Fiction", "Classic"], 1911, "Ten-year-old Mary Lennox unlocks an abandoned walled garden that transforms an entire estate."],
  [479, "A Little Princess", "Frances Hodgson Burnett", ["Children", "Fiction", "Classic"], 1905, "Sara Crewe's resilient imagination sustains her through poverty at Miss Minchin's boarding school."],
  [51, "Anne of Green Gables", "L.M. Montgomery", ["Family", "Children", "Classic"], 1908, "The spirited, imaginative orphan Anne Shirley mistakenly arrives at Prince Edward Island."],
  [544, "Anne of Avonlea", "L.M. Montgomery", ["Family", "Children", "Classic"], 1909, "Anne Shirley returns to her village as schoolteacher while preparing for college."],
  [2591, "Grimms' Fairy Tales", "Brothers Grimm", ["Children", "Fantasy", "Classic"], 1812, "The classic German folklore collection featuring Cinderella, Rapunzel, and Hansel and Gretel."],
  [272, "Andersen's Fairy Tales", "Hans Christian Andersen", ["Children", "Fantasy", "Classic"], 1875, "Beloved Danish tales including The Little Mermaid, The Ugly Duckling, and The Emperor's New Clothes."],
  [19942, "The Wind in the Willows", "Kenneth Grahame", ["Children", "Adventure", "Classic"], 1908, "The pastoral escapades of Mole, Ratty, Badger, and the irrepressible Mr. Toad of Toad Hall."],
  [74, "The Adventures of Tom Sawyer", "Mark Twain", ["Children", "Adventure", "Classic"], 1876, "Tom Sawyer's boyhood mischief and escapades along the banks of the Mississippi River."],
  [76, "Adventures of Huckleberry Finn", "Mark Twain", ["Adventure", "Fiction", "Classic"], 1884, "Huck Finn and the runaway slave Jim drift down the Mississippi on a raft seeking freedom."],
  [86, "A Connecticut Yankee in King Arthur's Court", "Mark Twain", ["Science Fiction", "Fantasy", "Classic"], 1889, "A nineteenth-century engineer is knocked unconscious and wakes in sixth-century Camelot."],
  [1837, "The Prince and the Pauper", "Mark Twain", ["Historical", "Fiction", "Classic"], 1881, "A pauper boy and Prince Edward VI swap clothing and lives in sixteenth-century London."],
  [135, "Les Misérables", "Victor Hugo", ["Historical", "Fiction", "Classic"], 1862, "Jean Valjean's quest for redemption and Inspector Javert's relentless pursuit across Paris."],
  [2610, "The Hunchback of Notre-Dame", "Victor Hugo", ["Historical", "Fiction", "Classic"], 1831, "The bell-ringer Quasimodo seeks sanctuary for the gypsy dancer Esmeralda in gothic Paris."]
];

// 16 Curated Copyrighted Books (Library Loans, 14-Day Checkout)
const copyrightedBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: ["Self-Help", "Non-Fiction"],
    description: "A proven framework for building good habits and eliminating bad ones using the power of 1% incremental improvements.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2018,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg"
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: ["Technology", "Non-Fiction"],
    description: "A handbook of agile software craftsmanship packed with principles, patterns, and refactoring practices for top-tier software.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2008,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg"
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    genre: ["Technology", "Non-Fiction"],
    description: "Enduring wisdom on pragmatic software engineering, developer philosophy, career development, and coding craftsmanship.",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 2019,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg"
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    genre: ["Technology", "Science"],
    description: "The definitive guide to data systems architecture, scalability, consistency models, streaming, and distributed computing.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2017,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781449373320-M.jpg"
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: ["History", "Non-Fiction", "Science"],
    description: "A groundbreaking survey tracing humanity's path from archaic hominids to the rulers of planet Earth through three great revolutions.",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 2011,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: ["Fiction", "Philosophy"],
    description: "An inspiring allegorical novel about Santiago, a shepherd boy who listens to his heart and follows his personal legend across the desert.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1988,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780061122415-M.jpg"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: ["Fiction", "Historical", "Classic"],
    description: "A poignant portrait of morality, compassion, and courage in the Jim Crow South through the eyes of young Scout Finch.",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 1960,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780060935467-M.jpg"
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: ["Non-Fiction", "Science", "Philosophy"],
    description: "Nobel laureate Kahneman reveals the two cognitive systems that drive the way we think, judge, and make crucial choices.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2011,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg"
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: ["Science Fiction", "Adventure"],
    description: "The premier sci-fi epic set on the desert planet Arrakis, revolving around spice, politics, religion, and the messiah Paul Atreides.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1965,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780441013593-M.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: ["Dystopian", "Fiction"],
    description: "The chilling depiction of perpetual surveillance, newspeak, thoughtcrimes, and omnipresent totalitarianism under Big Brother.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1949,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg"
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    genre: ["Self-Help", "Technology", "Non-Fiction"],
    description: "Rules for focused success in a distracted world, explaining how deliberate concentration unlocks exceptional output and fulfillment.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2016,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781455586691-M.jpg"
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: ["Self-Help", "Non-Fiction"],
    description: "Timeless lessons on wealth, greed, and human behavior that explore how personal attitudes shape financial outcomes.",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 2020,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780857197689-M.jpg"
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    genre: ["History", "Science", "Non-Fiction"],
    description: "A Pulitzer Prize-winning investigation into geographical and environmental factors that shaped the fates of human societies.",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 1997,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780393317558-M.jpg"
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: ["Mystery", "Fiction"],
    description: "A gripping psychological thriller about a woman's shocking act of violence against her husband—and the therapist obsessed with uncovering why.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2019,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781250301697-M.jpg"
  },
  {
    title: "Educated",
    author: "Tara Westover",
    genre: ["Non-Fiction", "History", "Family"],
    description: "An unforgettable memoir of an isolated girl born into a survivalist family in rural Idaho who teaches herself enough math and grammar to enter college.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2018,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780399590504-M.jpg"
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: ["Fantasy", "Fiction", "Philosophy"],
    description: "Between life and death there is a library containing endless books with the lives you could have lived if you had made different choices.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2020,
    readUrl: "",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780525559474-M.jpg"
  }
];

// Transform the public domain array into complete Book documents with coverImage
const formattedPublicDomain = publicDomainRaw.map(([id, title, author, genre, year, desc]) => ({
  title,
  author,
  genre,
  description: desc,
  totalCopies: 999,
  availableCopies: 999,
  publishedYear: year,
  readUrl: `https://www.gutenberg.org/ebooks/${id}`,
  coverImage: gutenbergCover(id)
}));

const allBooks = [...formattedPublicDomain, ...copyrightedBooks];

const seedBooks = async () => {
  try {
    await connectDB();
    await Book.deleteMany({});
    const addedBooks = await Book.insertMany(allBooks);
    console.log(`\n🎉 Successfully seeded ${addedBooks.length} books with covers into BookNest!`);
    console.log(`- 🟢 Public Domain (Instant Free Access): ${formattedPublicDomain.length} books`);
    console.log(`- 🔒 Copyrighted Library Loans: ${copyrightedBooks.length} books`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();