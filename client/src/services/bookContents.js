// Digital Book Content Database for Borrowed Copyrighted Titles
// Provides chapters, key takeaways, and in-depth reading content for books in the collection.

export const borrowedBookContents = {
  "Atomic Habits": {
    totalChapters: 6,
    chapters: [
      {
        title: "Chapter 1: The Surprising Power of Atomic Habits",
        content: `It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action. Whether it is losing weight, building a business, writing a book, winning a championship, or achieving any other goal, we put pressure on ourselves to make some earth-shattering improvement that everyone will talk about.

Meanwhile, improving by 1 percent isn't particularly notable—sometimes it isn't even noticeable—but it can be far more meaningful, especially in the long run. The difference a tiny improvement can make over time is astounding. Here's how the math works out: if you can get 1 percent better each day for one year, you'll end up thirty-seven times better by the time you're done. Conversely, if you get 1 percent worse each day for one year, you'll decline nearly down to zero. What starts as a small win or a minor setback accumulates into something much more.

Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them. They seem to make little difference on any given day and yet the impact they deliver over the months and years can be enormous. It is only when looking back two, five, or perhaps ten years later that the value of good habits and the cost of bad ones becomes strikingly apparent.`
      },
      {
        title: "Chapter 2: How Your Habits Shape Your Identity (and Vice Versa)",
        content: `Why is it so easy to repeat bad habits and so difficult to form good ones? Few things can have a more powerful impact on your life than improving your daily habits. And yet it is likely that this time next year you'll be doing the same thing rather than something better.

Changing our habits is challenging for two reasons: (1) we try to change the wrong thing and (2) we try to change our habits in the wrong way.

The first mistake is what we try to change. To understand what I mean, consider that there are three layers of behavior change: an outcome change, a process change, and an identity change.

Outcomes are about what you get. Processes are about what you do. Identity is about what you believe. When it comes to building habits that last—when it comes to building a system of 1 percent improvements—the problem is not that one level is 'better' or 'worse' than another. All levels of change are useful in their own way. The problem is the direction of change.

Many people begin the process of behavior change by focusing on what they want to achieve. This leads us to outcome-based habits. The alternative is to build identity-based habits. With this approach, we start by focusing on who we wish to become.`
      },
      {
        title: "Chapter 3: The 1st Law — Make It Obvious",
        content: `In 1936, the psychologist Kurt Lewin wrote a simple equation that stated behavior is a function of the person in their environment: B = f(P, E). 

Decades later, Anne Thorndike, a primary care physician at Massachusetts General Hospital in Boston, had a crazy idea. She believed she could improve the eating habits of thousands of hospital staff and visitors without changing their willpower or motivation in the slightest way. She redesigned the cafeteria so that bottled water was placed next to every food station and cash register. Over the next three months, sales of soda dropped by 11.4 percent, while sales of bottled water increased by 25.8 percent.

You don't have to be the victim of your environment. You can also be the architect of it. Small changes in context can lead to large changes in behavior over time. If you want to make a habit a big part of your life, make the cue a big part of your environment.`
      },
      {
        title: "Chapter 4: The 2nd Law — Make It Attractive",
        content: `The more attractive an opportunity is, the more likely it is to become habit-forming. Habits are a dopamine-driven feedback loop. When dopamine rises, so does our motivation to act.

It is the anticipation of a reward—not the fulfillment of it—that gets us to take action. The greater the anticipation, the greater the dopamine spike. 

Temptation bundling is one way to make your habits more attractive. The strategy is to pair an action you want to do with an action you need to do. Ronan Byrne, an electrical engineering student in Dublin, Ireland, knew he needed to exercise more, but he didn't want to. He hacked his stationary bike and connected it to his laptop and TV so that Netflix would only play if he was cycling at a certain speed. By bundling Netflix with exercise, he transformed an arduous task into an appealing experience.`
      },
      {
        title: "Chapter 5: The 3rd Law — Make It Easy",
        content: `How long does it actually take to form a new habit? During habit formation, a behavior becomes progressively more automatic as it is repeated through neuroplasticity.

The central insight is: habit formation is dependent on frequency, not time. It's not about how many days have passed; it's about how many repetitions you have completed.

To make a habit easy, reduce friction. The Two-Minute Rule states: 'When you start a new habit, it should take less than two minutes to do.' Almost any habit can be scaled down into a two-minute version: 'Read before bed each night' becomes 'Read one page.' 'Do thirty minutes of yoga' becomes 'Take out my yoga mat.' Establish the habit of showing up first before you worry about optimizing it.`
      },
      {
        title: "Chapter 6: The 4th Law — Make It Satisfying",
        content: `The first three laws of behavior change increase the odds that a behavior will be performed this time. The fourth law—Make It Satisfying—increases the odds that a behavior will be repeated next time.

What is immediately rewarded is repeated. What is immediately punished is avoided. The Cardinal Rule of Behavior Change: What gets rewarded gets done; what gets penalized gets dropped.

To get a habit to stick, you need to feel immediately successful—even if it's in a small way. The habit tracker is a classic example: crossing an item off your calendar provides immediate sensory satisfaction. Don't break the chain. If you miss one day, try to get back on track as quickly as possible. Never miss twice.`
      }
    ]
  },
  "Clean Code": {
    totalChapters: 5,
    chapters: [
      {
        title: "Chapter 1: Meaningful Names",
        content: `Names are everywhere in software. We name our variables, our functions, our arguments, classes, and packages. We name our source files and the directories that contain them. We name our build artifacts, jar files, and war files. Because we do so much of it, we'd better do it well.

Use intention-revealing names: The name of a variable, function, or class should answer all the big questions. It should tell you why it exists, what it does, and how it is used. If a name requires a comment, then the name does not reveal its intent.

Avoid disinformation: Programmers must avoid leaving false clues that obscure the meaning of code. Avoid words whose entrenched meanings vary from our intended meaning. For example, do not refer to a grouping of accounts as an 'accountList' unless it's actually a List.

Make meaningful distinctions: Number-series naming (a1, a2, .. aN) is the opposite of intentional naming. Such names are not disinformative—they are non-informative. Noise words like 'Info' or 'Data' in variable names are redundant and add zero semantic clarity.`
      },
      {
        title: "Chapter 2: Functions Should Do One Thing",
        content: `The first rule of functions is that they should be small. The second rule of functions is that they should be smaller than that!

Functions should do one thing. They should do it well. They should do it only.

If a function does only those steps that are one level below the stated name of the function, then the function is doing one thing. After all, the reason we write functions is to decompose a larger concept into a set of steps at the next level of abstraction.

One Level of Abstraction per Function: In order to make sure our functions are doing 'one thing', we need to make sure that the statements within our function are all at the same level of abstraction. Mixing levels of abstraction within a function is always confusing.`
      },
      {
        title: "Chapter 3: Comments Do Not Make Up for Bad Code",
        content: `Nothing can be quite so helpful as a good comment. Nothing can be more damaging than an old, inaccurate, or redundant comment.

Don't comment bad code—rewrite it.

The proper use of comments is to compensate for our failure to express ourself in code. Note that I used that word: failure. I meant it. Comments are always failures. We must have them because we cannot always figure out how to express ourselves without them, but their use is not a cause for celebration.

Clear and expressive code with few comments is far superior to cluttered and complex code with lots of comments.`
      },
      {
        title: "Chapter 4: Formatting and Structure",
        content: `Code formatting is important. It is too important to ignore and it is too important to treat religiously. Code formatting is about communication, and communication is the professional developer's first order of business.

The Newspaper Metaphor: Think of a well-written newspaper article. You read it vertically. At the top, you expect a headline that will tell you what the story is about and allows you to decide whether it is something you want to read. The first paragraph gives you a synopsis of the whole story, hiding all the details. As you continue downward, the details increase.

Vertical Density implies close association. So lines of code that are tightly related should appear vertically dense, while concepts that are distinct should be separated by empty lines.`
      },
      {
        title: "Chapter 5: Error Handling and Clean Architecture",
        content: `Error handling is important, but if it obscures logic, it's wrong. Things can go wrong, and when they do, we as programmers are responsible for making sure our code does what it needs to do.

Use Exceptions Rather Than Return Codes: Back in the distant past there were many languages that didn't have exceptions. In those languages the techniques for handling and reporting errors were limited. You either set an error flag or returned an error code. These approaches clutter the caller. When you use exceptions, the calling code is cleaner and its logic is not obscured by error handling.

Don't Return Null: If you are tempted to return null from a method, consider throwing an exception or returning a Special Case object instead. If you are calling an external API that returns null, consider wrapping that method with a method that either throws an exception or returns a null object.`
      }
    ]
  },
  "The Pragmatic Programmer": {
    totalChapters: 4,
    chapters: [
      {
        title: "Chapter 1: A Pragmatic Philosophy",
        content: `What distinguishes pragmatic programmers? We feel it's an attitude, a style, a philosophy of approaching problems and their solutions. They think beyond the immediate problem, always trying to place it in its larger context.

Care About Your Craft: Why spend your life developing software unless you care about doing it well?

Think! About Your Work: Never run on autopilot. Constantly criticize and appraise your work, your habits, and your tools.

Provide Options, Don't Make Excuses: Before you approach anyone to explain why something can't be done, is late, or is broken, stop and listen to yourself. Talk to your rubber duck or a colleague. Does your excuse sound reasonable or lame? Offer options instead.`
      },
      {
        title: "Chapter 2: DRY — Don't Repeat Yourself",
        content: `As programmers, we collect, organize, maintain, and harness knowledge. We document knowledge in specifications, we make it come alive in running code, and we use it to provide the checks needed during testing.

Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

The alternative is to have the same thing expressed in two or more places. If you change one, you have to remember to change the others. It isn't a question of whether you'll remember; it's a question of when you'll forget. Duplication leads to maintenance nightmares and bugs.`
      },
      {
        title: "Chapter 3: Orthogonality and Decoupling",
        content: `'Orthogonality' is a concept borrowed from geometry. Two lines are orthogonal if they meet at right angles. In computing, the term signifies independence or decoupling. Two or more things are orthogonal if changes in one do not affect any of the others.

In a well-designed system, the database code will be orthogonal to the user interface. You can change the interface without affecting the database, and swap databases without changing the GUI.

Eliminate effects between unrelated things. Write shy code: don't reveal too much about yourself and don't interact with too many people.`
      },
      {
        title: "Chapter 4: Tracer Bullets and Prototypes",
        content: `When you're exploring uncharted territory with new architectures, algorithms, or platforms, you have two great strategies: Tracer Bullets and Prototypes.

Tracer bullets leave a trail in the dark sky so gunners can adjust their aim in real time. In software, tracer code creates an end-to-end skeleton that works, connects all components, and delivers immediate visible progress.

Prototyping, on the other hand, is disposable experimentation. You write prototype code to test a specific risky hypothesis, and then you discard it cleanly. Don't confuse tracer code (which stays in the production build) with prototypes (which should be thrown away).`
      }
    ]
  },
  "Sapiens: A Brief History of Humankind": {
    totalChapters: 4,
    chapters: [
      {
        title: "Part 1: The Cognitive Revolution",
        content: `About 100,000 years ago, Earth was inhabited by at least six distinct species of humans. They were insignificant animals whose impact on the planet was no greater than that of gorillas, fireflies, or jellyfish.

Today, there is only one human species left: Homo sapiens. And we rule this planet.

How did our species win the battle for dominance? The answer lies in the Cognitive Revolution, which occurred approximately 70,000 years ago. Sapiens developed a unique language capable of conveying information about things that do not exist at all in the physical world: myths, legends, gods, nations, and legal corporations.

You could never convince a chimpanzee to give you a banana by promising him limitless bananas after death in chimpanzee heaven. Only Sapiens can believe such fictions. And because of shared fictions, thousands of unrelated strangers can cooperate flexibly toward a single goal.`
      },
      {
        title: "Part 2: The Agricultural Revolution — History's Biggest Fraud",
        content: `For 2.5 million years, humans fed themselves by gathering plants and hunting animals that lived and bred without their intervention. All this changed about 10,000 years ago, when Sapiens began to devote almost all their time and effort to manipulating the lives of a few animal and plant species.

Scholars once proclaimed that the agricultural revolution was a great leap forward for humanity. They told a tale of human intellect solving nature's secrets, freeing people from the harsh and perilous life of foraging.

That tale is a fantasy. The Agricultural Revolution certainly enlarged the sum total of food at the disposal of humankind, but the extra food did not translate into a better diet or more leisure. Rather, it translated into population explosions and pampered elites. The average farmer worked harder than the average forager, and received a worse diet in return.`
      },
      {
        title: "Part 3: The Unification of Humankind",
        content: `History moves inexorably toward global unity. The fragmentation of the ancient world has been replaced by three great unifiers that allow disparate peoples to trade, communicate, and align:

1. Money: The universal medium of mutual trust. Money is the only trust system created by humans that can bridge almost any cultural, religious, or political divide.
2. Imperial Orders: Empires united diverse populations under common administrative, legal, and linguistic frameworks.
3. Universal Religions: Providing transcendent authority and moral consensus across vast geographic expanses.`
      },
      {
        title: "Part 4: The Scientific Revolution",
        content: `During the last 500 years, human power has grown to an unprecedented degree. In the year 1500, humans were confined to Earth's surface and unable to split atoms or venture into space. Today, we stand on the threshold of creating synthetic life and artificial intelligence.

The Scientific Revolution was not a revolution of knowledge. It was, above all, a revolution of ignorance. It began with the revolutionary discovery that humans do not know the answers to their most important questions.

Prior traditions asserted that everything important was already known in holy scriptures or ancient wisdom. Modern science began with the admission: 'Ignoramus—we do not know.' That admission unlocked an insatiable quest for empirical observation, mathematics, and technological conquest.`
      }
    ]
  },
  "The Alchemist": {
    totalChapters: 4,
    chapters: [
      {
        title: "Part 1: The Boy and the Desert Calling",
        content: `The boy's name was Santiago. Dusk was falling as the boy arrived with his herd at an abandoned church. The roof had fallen in long ago, and an enormous sycamore had grown on the spot where the sacristy had once stood. He decided to spend the night there.

He saw to it that all the sheep entered through the ruined gate, and then laid some planks across it to prevent the flock from wandering away at night. There were no wolves in the region, but once an animal had strayed during the night, and the boy had spent the entire next day searching for it.

He swept the floor with his jacket and lay down, using the book he had just finished reading as a pillow. He told himself that he would have to start reading thicker books: they lasted longer, and made more comfortable pillows.

When he woke, it was still dark. Looking up, he could see the stars through the half-destroyed roof. He had had the same recurring dream again: a child who took him by the hands and transported him to the Egyptian pyramids, whispering that he would find a hidden treasure there.`
      },
      {
        title: "Part 2: The King of Salem and Personal Legends",
        content: `In the plaza of Tarifa, Santiago met an old man who called himself Melchizedek, the King of Salem. The old man asked for one-tenth of Santiago's flock in exchange for teaching him how to find the hidden treasure.

'It's the world's greatest lie,' the old man said.
'What is the world's greatest lie?' the boy asked, surprised.
'It's this: that at a certain point in our lives, we lose control of what's happening to us, and our lives become controlled by fate. That's the world's greatest lie.'

The old man explained that everyone, when they are young, knows what their Personal Legend is. At that period of their life, everything is clear and everything is possible. But as time passes, a mysterious force begins to convince them that it will be impossible for them to realize their destiny.`
      },
      {
        title: "Part 3: The Oasis and the Alchemist",
        content: `Santiago crossed the desert with a caravan and arrived at the Al-Fayoum oasis. There, among hundreds of palm trees and tents, he met Fatima at a well. The moment their eyes met, Santiago felt that the Soul of the World surged within him—the language that everyone on earth was capable of understanding in their heart: Love.

It was also in the desert that Santiago met the Alchemist on horseback. The Alchemist possessed the secrets of the Master Work: the Emerald Tablet, the Elixir of Life, and the Philosopher's Stone.

'Listen to your heart,' the Alchemist told the boy. 'It knows all things, because it came from the Soul of the World, and it will one day return there.'`
      },
      {
        title: "Part 4: The Pyramids and the Ultimate Truth",
        content: `When Santiago finally reached the Great Pyramids of Egypt, he wept with joy and began digging where his tears fell. Before he could unearth anything, refugees from tribal wars attacked him, beat him, and demanded gold.

Their leader laughed when Santiago confessed that a recurring dream told him treasure lay buried at the pyramids.

'You're not so clever,' the leader said. 'Two years ago, right here on this spot, I also had a dream. I dreamed that I should travel to the fields of Spain and look for a ruined church where shepherds sleep with their flocks. In the sacristy stood a sycamore, and if I dug at its roots, I would find a hidden treasure. But I'm not stupid enough to cross a desert just because of a dream!'

The boy stood up shakily, looking toward the pyramids. They seemed to smile at him, and he laughed out loud. His treasure had been buried in the ruined church back home all along—yet he needed the journey to discover who he truly was.`
      }
    ]
  },
  "1984": {
    totalChapters: 3,
    chapters: [
      {
        title: "Chapter 1: Big Brother is Watching You",
        content: `It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.

The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features. 

Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours. It was part of the economy drive in preparation for Hate Week. 

On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall. It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran.`
      },
      {
        title: "Chapter 2: The Principles of Newspeak",
        content: `In the Ministry of Truth, Syme was explaining the beauty of the destruction of words.

'Don't you see that the whole aim of Newspeak is to narrow the range of thought? In the end we shall make thoughtcrime literally impossible, because there will be no words in which to express it. Every concept that can ever be needed will be expressed by exactly one word, with its meaning rigidly defined and all its subsidiary meanings rubbed out and forgotten.'

'Every year fewer and fewer words, and the range of consciousness always a little smaller. Even now, of course, there's no reason or excuse for committing thoughtcrime. It's merely a question of self-discipline, reality-control. But in the end there won't be any need even for that.'

War is Peace. Freedom is Slavery. Ignorance is Strength.`
      },
      {
        title: "Chapter 3: Room 101",
        content: `'You asked me once,' said O'Brien, 'what was in Room 101. I told you that you knew the answer already. Everyone knows it. The thing that is in Room 101 is the worst thing in the world.'

The worst thing in the world varies from individual to individual. It may be burial alive, or death by fire, or drowning, or impalement, or fifty other deaths. There are cases where it is some quite small thing, not even fatal.

For Winston, the thing was rats. The cage with the wire mask was brought closer. And in that ultimate moment of terror, the last remnant of his humanity surrendered:

'Do it to Julia! Do it to Julia! Not me! Julia! I don't care what you do to her. Tear her face off, strip her to the bones. Not me! Julia! Not me!'

The struggle had ended. He had won the victory over himself. He loved Big Brother.`
      }
    ]
  }
};

// Generates fallback chapters for any other borrowed book title
export function getBookChapters(book) {
  if (!book) return [];

  // Check if we have tailored text
  if (borrowedBookContents[book.title]) {
    return borrowedBookContents[book.title].chapters;
  }

  // Otherwise generate dynamic, structured book content based on its synopsis & metadata
  const title = book.title || 'Borrowed Title';
  const author = book.author || 'Author';
  const genre = book.genre?.join(', ') || 'Literature';
  const year = book.publishedYear || 'Recent Edition';
  const desc = book.description || 'A masterpiece of storytelling and insight.';

  return [
    {
      title: "Chapter 1: Introduction & Core Foundations",
      content: `Welcome to the digital library edition of "${title}" by ${author} (${year}).

${desc}

In this opening section, the author establishes the foundational context of the work. Setting the tone within the realm of ${genre}, the narrative explores how core ideas take shape and influence the world around us. 

Through carefully constructed themes, the author invites the reader to reconsider conventional assumptions and examine the broader implications of each perspective introduced.`
    },
    {
      title: "Chapter 2: Principles, Ideas & Core Developments",
      content: `As "${title}" advances into its central arguments, ${author} delves into the detailed mechanisms and narrative arcs that define the work.

Key Insights explored in this section:
1. Understanding the broader landscape: How historical, social, and personal forces intersect to drive progress.
2. The role of deliberate practice: Why mastery and awareness demand conscious attention to subtle patterns.
3. Overcoming structural friction: Strategies and reflections on navigating obstacles that arise when striving for meaningful transformation.

The dialogue between theory and real-world application provides a rich tapestry that continues to captivate readers across generations.`
    },
    {
      title: "Chapter 3: Climax, Synthesis & Critical Takeaways",
      content: `In the culminating chapters of "${title}", the primary threads of inquiry converge into an illuminating synthesis.

${author} demonstrates that true understanding is not merely about accumulating facts or following events passively, but about integrating insights into how we think, decide, and act in our daily lives.

Key Takeaways for the Reader:
- Knowledge gains its true power through consistent execution and thoughtful reflection.
- The principles outlined in this volume remain as vital today as when first penned in ${year}.
- As you conclude your 14-day checkout loan with BookNest, reflect upon how the lessons from "${title}" can be applied in your own pursuits.`
    }
  ];
}
