"""A Message of the Day."""

from jupiter.core.common.url import URL
from jupiter.framework.value import CompositeValue, value


@value
class MOTD(CompositeValue):
    """A Message of the Day."""

    quote: str
    author: str
    wikiquote_link: URL


MOTDs = [
    MOTD(
        quote="It is not that we have a short time to live, but that we waste a lot of it.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="The impediment to action advances action. What stands in the way becomes the way.",
        author="Marcus Aurelius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marcus_Aurelius"),
    ),
    MOTD(
        quote="He who has a why to live can bear almost any how.",
        author="Friedrich Nietzsche",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Friedrich_Nietzsche"),
    ),
    MOTD(
        quote="Waste no more time arguing about what a good man should be. Be one.",
        author="Marcus Aurelius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marcus_Aurelius"),
    ),
    MOTD(
        quote="Discipline equals freedom.",
        author="Jocko Willink",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Jocko_Willink"),
    ),
    MOTD(
        quote="You have power over your mind - not outside events. Realize this, and you will find strength.",
        author="Marcus Aurelius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marcus_Aurelius"),
    ),
    MOTD(
        quote="Don't explain your philosophy. Embody it.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="How long are you going to wait before you demand the best for yourself?",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="First say to yourself what you would be; and then do what you have to do.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="You become what you give your attention to.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="The whole future lies in uncertainty: live immediately.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="No man is free, who is not master of himself.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="A man who has committed a mistake and doesn't correct it, is committing another mistake.",
        author="Confucius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Confucius"),
    ),
    MOTD(
        quote="Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author="Winston Churchill",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Winston_Churchill"),
    ),
    MOTD(
        quote="You must be the change you wish to see in the world.",
        author="Mahatma Gandhi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mahatma_Gandhi"),
    ),
    MOTD(
        quote="The best way to find yourself is to lose yourself in the service of others.",
        author="Mahatma Gandhi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mahatma_Gandhi"),
    ),
    MOTD(
        quote="He who opens a school door, closes a prison.",
        author="Victor Hugo",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Victor_Hugo"),
    ),
    MOTD(
        quote="To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="Do not go where the path may lead, go instead where there is no path and leave a trail.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="Be not afraid of going slowly, be afraid only of standing still.",
        author="Chinese Proverb",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Chinese_proverbs"),
    ),
    MOTD(
        quote="The journey of a thousand miles begins with one step.",
        author="Laozi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Laozi"),
    ),
    MOTD(
        quote="Do every act of your life as though it were the very last act of your life.",
        author="Marcus Aurelius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marcus_Aurelius"),
    ),
    MOTD(
        quote="Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
        author="Marcus Aurelius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marcus_Aurelius"),
    ),
    MOTD(
        quote="The more we value things outside our control, the less control we have.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="Don't seek for everything to happen as you wish it would, but rather wish that everything happens as it actually will—then your life will flow well.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="Difficulties strengthen the mind, as labor does the body.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="It does not matter what you bear, but how you bear it.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="No man was ever wise by chance.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="He who angers you conquers you.",
        author="Elizabeth Kenny",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Elizabeth_Kenny"),
    ),
    MOTD(
        quote="Our life is what our thoughts make it.",
        author="Marcus Aurelius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marcus_Aurelius"),
    ),
    MOTD(
        quote="Be tolerant with others and strict with yourself.",
        author="Marcus Aurelius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marcus_Aurelius"),
    ),
    MOTD(
        quote="If you want to improve, be content to be thought foolish and stupid.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="Know, first, who you are, and then adorn yourself accordingly.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="It is the power of the mind to be unconquerable.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="Don't stumble over something behind you.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="To wish to be well is a part of becoming well.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="The mind that is anxious about future events is miserable.",
        author="Seneca",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Seneca_the_Younger"),
    ),
    MOTD(
        quote="Wealth consists not in having great possessions, but in having few wants.",
        author="Epictetus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epictetus"),
    ),
    MOTD(
        quote="Make the mind tougher by exposing it to adversity.",
        author="Robert Greene",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Robert_Greene"),
    ),
    MOTD(
        quote="The greater the difficulty, the more glory in surmounting it.",
        author="Epicurus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Epicurus"),
    ),
    MOTD(
        quote="We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        author="Aristotle",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Aristotle"),
    ),
    MOTD(
        quote="Knowing yourself is the beginning of all wisdom.",
        author="Aristotle",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Aristotle"),
    ),
    MOTD(
        quote="It is the mark of an educated mind to be able to entertain a thought without accepting it.",
        author="Aristotle",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Aristotle"),
    ),
    MOTD(
        quote="The unexamined life is not worth living.",
        author="Socrates",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Socrates"),
    ),
    MOTD(
        quote="I know that I am intelligent, because I know that I know nothing.",
        author="Socrates",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Socrates"),
    ),
    MOTD(
        quote="The secret of change is to focus all of your energy not on fighting the old, but on building the new.",
        author="Socrates",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Socrates"),
    ),
    MOTD(
        quote="Be kind, for everyone you meet is fighting a hard battle.",
        author="Plato",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Plato"),
    ),
    MOTD(
        quote="The price good men pay for indifference to public affairs is to be ruled by evil men.",
        author="Plato",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Plato"),
    ),
    MOTD(
        quote="Imagination is more important than knowledge.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="Life is like riding a bicycle. To keep your balance, you must keep moving.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="The only source of knowledge is experience.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="In the middle of difficulty lies opportunity.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="Give me six hours to chop down a tree and I will spend the first four sharpening the axe.",
        author="Abraham Lincoln",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Abraham_Lincoln"),
    ),
    MOTD(
        quote="Whatever you are, be a good one.",
        author="Abraham Lincoln",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Abraham_Lincoln"),
    ),
    MOTD(
        quote="Tell me and I forget. Teach me and I remember. Involve me and I learn.",
        author="Benjamin Franklin",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Benjamin_Franklin"),
    ),
    MOTD(
        quote="An investment in knowledge pays the best interest.",
        author="Benjamin Franklin",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Benjamin_Franklin"),
    ),
    MOTD(
        quote="Well done is better than well said.",
        author="Benjamin Franklin",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Benjamin_Franklin"),
    ),
    MOTD(
        quote="Do what you can, with what you have, where you are.",
        author="Theodore Roosevelt",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Theodore_Roosevelt"),
    ),
    MOTD(
        quote="Believe you can and you're halfway there.",
        author="Theodore Roosevelt",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Theodore_Roosevelt"),
    ),
    MOTD(
        quote="That which does not kill us, makes us stronger.",
        author="Friedrich Nietzsche",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Friedrich_Nietzsche"),
    ),
    MOTD(
        quote="Without music, life would be a mistake.",
        author="Friedrich Nietzsche",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Friedrich_Nietzsche"),
    ),
    MOTD(
        quote="The secret to getting ahead is getting started.",
        author="Mark Twain",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mark_Twain"),
    ),
    MOTD(
        quote="The two most important days in your life are the day you are born and the day you find out why.",
        author="Mark Twain",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mark_Twain"),
    ),
    MOTD(
        quote="Good friends, good books, and a sleepy conscience: this is the ideal life.",
        author="Mark Twain",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mark_Twain"),
    ),
    MOTD(
        quote="Be yourself; everyone else is already taken.",
        author="Oscar Wilde",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Oscar_Wilde"),
    ),
    MOTD(
        quote="To live is the rarest thing in the world. Most people exist, that is all.",
        author="Oscar Wilde",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Oscar_Wilde"),
    ),
    MOTD(
        quote="We are all in the gutter, but some of us are looking at the stars.",
        author="Oscar Wilde",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Oscar_Wilde"),
    ),
    MOTD(
        quote="Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.",
        author="Khalil Gibran",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Kahlil_Gibran"),
    ),
    MOTD(
        quote="Your pain is the breaking of the shell that encloses your understanding.",
        author="Khalil Gibran",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Kahlil_Gibran"),
    ),
    MOTD(
        quote="Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
        author="Bill Keane",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bill_Keane"),
    ),
    MOTD(
        quote="The only way to do great work is to love what you do.",
        author="Steve Jobs",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Steve_Jobs"),
    ),
    MOTD(
        quote="Stay hungry, stay foolish.",
        author="Steve Jobs",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Steve_Jobs"),
    ),
    MOTD(
        quote="In the end, it's not the years in your life that count. It's the life in your years.",
        author="Abraham Lincoln",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Abraham_Lincoln"),
    ),
    MOTD(
        quote="The measure of intelligence is the ability to change.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="It does not matter how slowly you go as long as you do not stop.",
        author="Confucius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Confucius"),
    ),
    MOTD(
        quote="Our greatest glory is not in never falling, but in rising every time we fall.",
        author="Confucius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Confucius"),
    ),
    MOTD(
        quote="Life is really simple, but we insist on making it complicated.",
        author="Confucius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Confucius"),
    ),
    MOTD(
        quote="The man who moves a mountain begins by carrying away small stones.",
        author="Confucius",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Confucius"),
    ),
    MOTD(
        quote="We must accept finite disappointment, but never lose infinite hope.",
        author="Martin Luther King Jr.",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Martin_Luther_King_Jr."),
    ),
    MOTD(
        quote="Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.",
        author="Martin Luther King Jr.",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Martin_Luther_King_Jr."),
    ),
    MOTD(
        quote="The time is always right to do what is right.",
        author="Martin Luther King Jr.",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Martin_Luther_King_Jr."),
    ),
    MOTD(
        quote="It always seems impossible until it's done.",
        author="Nelson Mandela",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Nelson_Mandela"),
    ),
    MOTD(
        quote="Education is the most powerful weapon which you can use to change the world.",
        author="Nelson Mandela",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Nelson_Mandela"),
    ),
    MOTD(
        quote="I never lose. I either win or learn.",
        author="Nelson Mandela",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Nelson_Mandela"),
    ),
    MOTD(
        quote="The only thing we have to fear is fear itself.",
        author="Franklin D. Roosevelt",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Franklin_D._Roosevelt"),
    ),
    MOTD(
        quote="Happiness is not something ready made. It comes from your own actions.",
        author="Dalai Lama",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Dalai_Lama"),
    ),
    MOTD(
        quote="If you want others to be happy, practice compassion. If you want to be happy, practice compassion.",
        author="Dalai Lama",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Dalai_Lama"),
    ),
    MOTD(
        quote="The purpose of our lives is to be happy.",
        author="Dalai Lama",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Dalai_Lama"),
    ),
    MOTD(
        quote="Man is condemned to be free.",
        author="Jean-Paul Sartre",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Jean-Paul_Sartre"),
    ),
    MOTD(
        quote="Hell is other people.",
        author="Jean-Paul Sartre",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Jean-Paul_Sartre"),
    ),
    MOTD(
        quote="You will never be happy if you continue to search for what happiness consists of.",
        author="Albert Camus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Camus"),
    ),
    MOTD(
        quote="In the midst of winter, I found there was, within me, an invincible summer.",
        author="Albert Camus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Camus"),
    ),
    MOTD(
        quote="Don't walk behind me; I may not lead. Don't walk in front of me; I may not follow. Just walk beside me and be my friend.",
        author="Albert Camus",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Camus"),
    ),
    MOTD(
        quote="The most courageous act is still to think for yourself. Aloud.",
        author="Coco Chanel",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Coco_Chanel"),
    ),
    MOTD(
        quote="A reader lives a thousand lives before he dies. The man who never reads lives only one.",
        author="George R.R. Martin",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/George_R._R._Martin"),
    ),
    MOTD(
        quote="The good life is one inspired by love and guided by knowledge.",
        author="Bertrand Russell",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bertrand_Russell"),
    ),
    MOTD(
        quote="The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.",
        author="Bertrand Russell",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bertrand_Russell"),
    ),
    MOTD(
        quote="Three passions, simple but overwhelmingly strong, have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind.",
        author="Bertrand Russell",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bertrand_Russell"),
    ),
    MOTD(
        quote="To be without some of the things you want is an indispensable part of happiness.",
        author="Bertrand Russell",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bertrand_Russell"),
    ),
    MOTD(
        quote="Man only likes to count his troubles; he doesn't calculate his happiness.",
        author="Fyodor Dostoevsky",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Fyodor_Dostoevsky"),
    ),
    MOTD(
        quote="Pain and suffering are always inevitable for a large intelligence and a deep heart.",
        author="Fyodor Dostoevsky",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Fyodor_Dostoevsky"),
    ),
    MOTD(
        quote="The mystery of human existence lies not in just staying alive, but in finding something to live for.",
        author="Fyodor Dostoevsky",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Fyodor_Dostoevsky"),
    ),
    MOTD(
        quote="Everyone thinks of changing the world, but no one thinks of changing himself.",
        author="Leo Tolstoy",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Leo_Tolstoy"),
    ),
    MOTD(
        quote="The two most powerful warriors are patience and time.",
        author="Leo Tolstoy",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Leo_Tolstoy"),
    ),
    MOTD(
        quote="All great literature is one of two stories; a man goes on a journey or a stranger comes to town.",
        author="Leo Tolstoy",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Leo_Tolstoy"),
    ),
    MOTD(
        quote="Even if I knew that tomorrow the world would go to pieces, I would still plant my apple tree.",
        author="Martin Luther",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Martin_Luther"),
    ),
    MOTD(
        quote="You don't have to be great to start, but you have to start to be great.",
        author="Zig Ziglar",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Zig_Ziglar"),
    ),
    MOTD(
        quote="It is not the mountain we conquer, but ourselves.",
        author="Edmund Hillary",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Edmund_Hillary"),
    ),
    MOTD(
        quote="The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.",
        author="John Milton",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/John_Milton"),
    ),
    MOTD(
        quote="Not all those who wander are lost.",
        author="J.R.R. Tolkien",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/J._R._R._Tolkien"),
    ),
    MOTD(
        quote="It's a dangerous business, Frodo, going out your door. You step onto the road, and if you don't keep your feet, there's no knowing where you might be swept off to.",
        author="J.R.R. Tolkien",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/J._R._R._Tolkien"),
    ),
    MOTD(
        quote="There is some good in this world, and it's worth fighting for.",
        author="J.R.R. Tolkien",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/J._R._R._Tolkien"),
    ),
    MOTD(
        quote="All we have to decide is what to do with the time that is given us.",
        author="J.R.R. Tolkien",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/J._R._R._Tolkien"),
    ),
    MOTD(
        quote="It is our choices that show what we truly are, far more than our abilities.",
        author="J.K. Rowling",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/J._K._Rowling"),
    ),
    MOTD(
        quote="Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
        author="J.K. Rowling",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/J._K._Rowling"),
    ),
    MOTD(
        quote="It is impossible to live without failing at something, unless you live so cautiously that you might as well not have lived at all.",
        author="J.K. Rowling",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/J._K._Rowling"),
    ),
    MOTD(
        quote="The cave you fear to enter holds the treasure you seek.",
        author="Joseph Campbell",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Joseph_Campbell"),
    ),
    MOTD(
        quote="We must be willing to let go of the life we planned so as to have the life that is waiting for us.",
        author="Joseph Campbell",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Joseph_Campbell"),
    ),
    MOTD(
        quote="The big question is whether you are going to be able to say a hearty yes to your adventure.",
        author="Joseph Campbell",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Joseph_Campbell"),
    ),
    MOTD(
        quote="If you do not change direction, you may end up where you are heading.",
        author="Laozi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Laozi"),
    ),
    MOTD(
        quote="Kindness in words creates confidence. Kindness in thinking creates profoundness. Kindness in giving creates love.",
        author="Laozi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Laozi"),
    ),
    MOTD(
        quote="Nature does not hurry, yet everything is accomplished.",
        author="Laozi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Laozi"),
    ),
    MOTD(
        quote="He who knows others is wise; he who knows himself is enlightened.",
        author="Laozi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Laozi"),
    ),
    MOTD(
        quote="Appear weak when you are strong, and strong when you are weak.",
        author="Sun Tzu",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Sun_Tzu"),
    ),
    MOTD(
        quote="The supreme art of war is to subdue the enemy without fighting.",
        author="Sun Tzu",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Sun_Tzu"),
    ),
    MOTD(
        quote="In the midst of chaos, there is also opportunity.",
        author="Sun Tzu",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Sun_Tzu"),
    ),
    MOTD(
        quote="Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
        author="Sun Tzu",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Sun_Tzu"),
    ),
    MOTD(
        quote="An eye for an eye will only make the whole world blind.",
        author="Mahatma Gandhi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mahatma_Gandhi"),
    ),
    MOTD(
        quote="The weak can never forgive. Forgiveness is the attribute of the strong.",
        author="Mahatma Gandhi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mahatma_Gandhi"),
    ),
    MOTD(
        quote="Live as if you were to die tomorrow. Learn as if you were to live forever.",
        author="Mahatma Gandhi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Mahatma_Gandhi"),
    ),
    MOTD(
        quote="A ship in harbour is safe, but that is not what ships are for.",
        author="John A. Shedd",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/John_A._Shedd"),
    ),
    MOTD(
        quote="You miss 100% of the shots you don't take.",
        author="Wayne Gretzky",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Wayne_Gretzky"),
    ),
    MOTD(
        quote="The only person you are destined to become is the person you decide to be.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="For every minute you are angry you lose sixty seconds of happiness.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="The only way out of the labyrinth of suffering is to forgive.",
        author="John Green",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/John_Green"),
    ),
    MOTD(
        quote="I am not afraid of storms, for I am learning how to sail my ship.",
        author="Louisa May Alcott",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Louisa_May_Alcott"),
    ),
    MOTD(
        quote="No one can make you feel inferior without your consent.",
        author="Eleanor Roosevelt",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Eleanor_Roosevelt"),
    ),
    MOTD(
        quote="Do one thing every day that scares you.",
        author="Eleanor Roosevelt",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Eleanor_Roosevelt"),
    ),
    MOTD(
        quote="The future belongs to those who believe in the beauty of their dreams.",
        author="Eleanor Roosevelt",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Eleanor_Roosevelt"),
    ),
    MOTD(
        quote="With the new day comes new strength and new thoughts.",
        author="Eleanor Roosevelt",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Eleanor_Roosevelt"),
    ),
    MOTD(
        quote="Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
        author="Maya Angelou",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Maya_Angelou"),
    ),
    MOTD(
        quote="You may not control all the events that happen to you, but you can decide not to be reduced by them.",
        author="Maya Angelou",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Maya_Angelou"),
    ),
    MOTD(
        quote="We may encounter many defeats but we must not be defeated.",
        author="Maya Angelou",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Maya_Angelou"),
    ),
    MOTD(
        quote="If you don't like something, change it. If you can't change it, change your attitude.",
        author="Maya Angelou",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Maya_Angelou"),
    ),
    MOTD(
        quote="The brick walls are there for a reason. The brick walls are not there to keep us out. The brick walls are there to give us a chance to show how badly we want something.",
        author="Randy Pausch",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Randy_Pausch"),
    ),
    MOTD(
        quote="We cannot solve our problems with the same thinking we used when we created them.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="Strive not to be a success, but rather to be of value.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="A person who never made a mistake never tried anything new.",
        author="Albert Einstein",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Albert_Einstein"),
    ),
    MOTD(
        quote="The mind is not a vessel to be filled, but a fire to be kindled.",
        author="Plutarch",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Plutarch"),
    ),
    MOTD(
        quote="What we achieve inwardly will change outer reality.",
        author="Plutarch",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Plutarch"),
    ),
    MOTD(
        quote="Silence at the proper season is wisdom, and better than any speech.",
        author="Plutarch",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Plutarch"),
    ),
    MOTD(
        quote="Employ your time in improving yourself by other men's writings, so that you shall gain easily what others have labored hard for.",
        author="Socrates",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Socrates"),
    ),
    MOTD(
        quote="He is richest who is content with the least, for content is the wealth of nature.",
        author="Socrates",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Socrates"),
    ),
    MOTD(
        quote="I have learned to seek my happiness by limiting my desires, rather than in attempting to satisfy them.",
        author="John Stuart Mill",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/John_Stuart_Mill"),
    ),
    MOTD(
        quote="One person with a belief is equal to a force of ninety-nine who have only interests.",
        author="John Stuart Mill",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/John_Stuart_Mill"),
    ),
    MOTD(
        quote="Act only according to that maxim whereby you can, at the same time, will that it should become a universal law.",
        author="Immanuel Kant",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Immanuel_Kant"),
    ),
    MOTD(
        quote="Two things fill the mind with ever new and increasing wonder and awe — the starry heavens above me and the moral law within me.",
        author="Immanuel Kant",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Immanuel_Kant"),
    ),
    MOTD(
        quote="I think therefore I am.",
        author="René Descartes",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ren%C3%A9_Descartes"),
    ),
    MOTD(
        quote="The reading of all good books is like a conversation with the finest minds of past centuries.",
        author="René Descartes",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ren%C3%A9_Descartes"),
    ),
    MOTD(
        quote="To conquer oneself is a greater victory than to conquer thousands in a battle.",
        author="Dhammapada",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Dhammapada"),
    ),
    MOTD(
        quote="Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
        author="Rumi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Rumi"),
    ),
    MOTD(
        quote="Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.",
        author="Rumi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Rumi"),
    ),
    MOTD(
        quote="Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
        author="Rumi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Rumi"),
    ),
    MOTD(
        quote="Sell your cleverness and buy bewilderment.",
        author="Rumi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Rumi"),
    ),
    MOTD(
        quote="The wound is the place where the light enters you.",
        author="Rumi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Rumi"),
    ),
    MOTD(
        quote="Be a lamp, or a lifeboat, or a ladder. Help someone's soul heal.",
        author="Rumi",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Rumi"),
    ),
    MOTD(
        quote="Be like water making its way through cracks. Do not be assertive, but adjust to the object.",
        author="Bruce Lee",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bruce_Lee"),
    ),
    MOTD(
        quote="Absorb what is useful, discard what is useless and add what is specifically your own.",
        author="Bruce Lee",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bruce_Lee"),
    ),
    MOTD(
        quote="If you spend too much time thinking about a thing, you'll never get it done.",
        author="Bruce Lee",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bruce_Lee"),
    ),
    MOTD(
        quote="A wise man can learn more from a foolish question than a fool can learn from a wise answer.",
        author="Bruce Lee",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Bruce_Lee"),
    ),
    MOTD(
        quote="The only true wisdom is in knowing you know nothing.",
        author="Socrates",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Socrates"),
    ),
    MOTD(
        quote="Wealth is the ability to fully experience life.",
        author="Henry David Thoreau",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Henry_David_Thoreau"),
    ),
    MOTD(
        quote="Go confidently in the direction of your dreams. Live the life you have imagined.",
        author="Henry David Thoreau",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Henry_David_Thoreau"),
    ),
    MOTD(
        quote="Not until we are lost do we begin to understand ourselves.",
        author="Henry David Thoreau",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Henry_David_Thoreau"),
    ),
    MOTD(
        quote="What you do speaks so loudly that I cannot hear what you say.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="To different minds, the same world is a hell, and a heaven.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="The only way to have a friend is to be one.",
        author="Ralph Waldo Emerson",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Ralph_Waldo_Emerson"),
    ),
    MOTD(
        quote="Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
        author="Marie Curie",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marie_Curie"),
    ),
    MOTD(
        quote="Be less curious about people and more curious about ideas.",
        author="Marie Curie",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Marie_Curie"),
    ),
    MOTD(
        quote="Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened.",
        author="Helen Keller",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Helen_Keller"),
    ),
    MOTD(
        quote="Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.",
        author="Helen Keller",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Helen_Keller"),
    ),
    MOTD(
        quote="Alone we can do so little; together we can do so much.",
        author="Helen Keller",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Helen_Keller"),
    ),
    MOTD(
        quote="The real test is not whether you avoid failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it.",
        author="Barack Obama",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Barack_Obama"),
    ),
    MOTD(
        quote="Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.",
        author="Barack Obama",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Barack_Obama"),
    ),
    MOTD(
        quote="The secret of getting things done is to act.",
        author="Dante Alighieri",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Dante_Alighieri"),
    ),
    MOTD(
        quote="Follow your own star!",
        author="Dante Alighieri",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Dante_Alighieri"),
    ),
    MOTD(
        quote="Consider your origin. You were not formed to live like brutes but to follow virtue and knowledge.",
        author="Dante Alighieri",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Dante_Alighieri"),
    ),
    MOTD(
        quote="God has given us the gift of life; it is up to us to give ourselves the gift of living well.",
        author="Voltaire",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Voltaire"),
    ),
    MOTD(
        quote="Judge a man by his questions rather than his answers.",
        author="Voltaire",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Voltaire"),
    ),
    MOTD(
        quote="The most important decision you make is to be in a good mood.",
        author="Voltaire",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Voltaire"),
    ),
    MOTD(
        quote="Every man is guilty of all the good he did not do.",
        author="Voltaire",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Voltaire"),
    ),
    MOTD(
        quote="Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
        author="Antoine de Saint-Exupéry",
        wikiquote_link=URL(
            "https://en.wikiquote.org/wiki/Antoine_de_Saint-Exup%C3%A9ry"
        ),
    ),
    MOTD(
        quote="If you want to build a ship, don't drum up the men to gather wood, divide the work, and give orders. Instead, teach them to yearn for the vast and endless sea.",
        author="Antoine de Saint-Exupéry",
        wikiquote_link=URL(
            "https://en.wikiquote.org/wiki/Antoine_de_Saint-Exup%C3%A9ry"
        ),
    ),
    MOTD(
        quote="It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
        author="Antoine de Saint-Exupéry",
        wikiquote_link=URL(
            "https://en.wikiquote.org/wiki/Antoine_de_Saint-Exup%C3%A9ry"
        ),
    ),
    MOTD(
        quote="A goal without a plan is just a wish.",
        author="Antoine de Saint-Exupéry",
        wikiquote_link=URL(
            "https://en.wikiquote.org/wiki/Antoine_de_Saint-Exup%C3%A9ry"
        ),
    ),
    MOTD(
        quote="Courage is not the absence of fear, but the triumph over it.",
        author="Nelson Mandela",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Nelson_Mandela"),
    ),
    MOTD(
        quote="It always seems impossible until it is done.",
        author="Nelson Mandela",
        wikiquote_link=URL("https://en.wikiquote.org/wiki/Nelson_Mandela"),
    ),
]
