# Zack's own notes (verbatim from `notes 1.docx`)

His voice and his facts. **This is the source of truth for content** — it outranks anything currently on the site, all of which is invented placeholder.

---

Introduction
Hi, I’m Ren Hwa, but feel free to call me Zack. I’m really excited to be here today and I’m looking forward to sharing how my background and experience can contribute to your team.
I studied Computer Science at NTU and graduated about a year ago. Back at university, I mainly focused on web development, but after working on a few analytics projects, I discovered a strong interest in data. As I got closer to graduation, I wasn’t exactly sure which path to take, I just knew I enjoyed working with data. I found myself deciding whether to go into traditional data engineering, maintaining databases and building data systems, or to explore the AI side more deeply. I decided to go for the latter, and I ended up working as an AI Engineer at AI Singapore.
At AISG, it was eye-opening to see how our projects directly improved game developers’ workflows and created real value. What I found to be rewarding was to see complex, automated solutions come together and make a difference. That’s when I realised that what I really enjoy is building systems and tools that solve problems, especially when they involve data.
Since then, I’ve gained experience across different areas in AI. At AISG, I worked on GenAI diffusion models similar to DALL·E for text-to-image generation. At NIE, I focused on speech and signal processing, and at the Department of Statistics, I worked with Large Language Models and text analytics. But I wouldn’t really sell myself as an AI engineer, but more as a software engineer specialising in data. I’m just as comfortable managing data, whether that’s setting up databases or building ETL pipelines, because at the end of the day, you can’t build good AI models without good data. 
Beyond the technical side, I’ve also worked closely with stakeholders and clients, and I enjoy breaking down complex ideas into clear, practical terms.
Outside of work, I love rock climbing, cooking, and playing the guitar.

Work Experience
AI Singapore
At AI Singapore, I worked on developing a GenAI MVP for a company in the gaming industry. To give you some context, creating 3D animations for games is typically a very time-consuming process, developers have to design characters, build rigs, and animate movements manually from scratch.
Our goal was to streamline that by allowing developers to generate animations directly from text prompts, basically, like using ChatGPT but for motion animation. So, for example, a simple prompt like ‘a man walking’ would produce a walking animation automatically, where both the joints and the mesh could be directly imported into unity, a game engine. We trained a diffusion model similar to DALL·E 2 that could interpret these prompts and generate complex 3D motion data.
One of the main challenges was that the motion data came from different sources and in different formats. Motion capture data is quite complex, it includes joint positions, kinematics (like how moving an elbow affects the whole arm and fingers), and velocities. We needed to consolidate all these varied datasets and build a modular pipeline that could convert them into a single, standardized format for training.
Another challenge was data quality. The dataset relied on pairs of text prompts and motion clips, but sometimes the prompts were missing or incomplete. Since better input means better model output, we tackled this by implementing a video captioning model in our pipeline to automatically generate missing descriptions. This significantly improved the dataset’s quality and boosted our final model’s performance.
NIE
During my time at the National Institute of Education, I worked on a project studying student participation in discussions. We analyzed over 200 hours of recordings to understand how students' speaking patterns, interruptions, and interactions influenced their academic performance and emotions. So this problem is actually in the domain of speaker diarization, or “who speaks when”. We actually refer to this as a cocktail problem, which is actually known as a really hard problem to solve in the AI domain, just because there are so many variables and noise. The process involves detecting voices, converting them into embeddings for richer information, and using clustering techniques to identify who spoke to whom. 

I also had to perform data labelling or transcriptions on the audio recordings to get data for both evaluation and fine tuning the models. We also applied some preprocessing, there’s this process known as beamforming to actually increase the quality of the voice signal.  with dual microphones to enhance voice processing accuracy. By comparing the time it takes for sound to reach different microphones in a dual-microphone setup, beamforming algorithms can determine the direction of the sound source and focus on it, effectively canceling out sounds from other directions. 

When a sound source is not directly in front of a dual-microphone setup, the sound waves will reach the two microphones at slightly different times. This difference in arrival time, or TDOA, is directly related to the angle of the sound source relative to the microphone pair.  The core of dual beamforming is a delay-and-sum beamformer.  This algorithm calculates the time delays needed to align the sound waves received by both microphones, effectively compensating for the TDOA. By delaying the signal from the microphone that received the sound later and summing the two signals, the desired signal is reinforced, while noise and sounds from other directions are attenuated.
DOS
As an intern at the Singapore Department of Statistics, I worked with Large Language Models (LLMs) for various applications, including report generation, Q&amp;A bots, and industry classification based on textual data. 

It was an early stage in LLMs' development, and we were exploring their potential across different departments to streamline processes and enhance data analysis capabilities. At that time, I think LangChain had just been released around that time, and there was a lot of talk about it being bloated, quite funny considering how widely it’s used in production today.

One project involved building a chatbot to answer frequently asked questions received by SingStat, such as inquiries about statistical definitions or data sources. Another use case supported the Economic Development Board, where analysts needed to review PDFs, news articles, and CSVs to prepare quarterly outlook reports for various sectors of the Singapore economy. We were already using Retrieval-Augmented Generation (RAG) for both of these applications, even back in 2023.

Tessaract
At Tesseract.io, my role primarily focused on database management and migration for law and insurance firms. I handled tasks ranging from optimizing database performance using Python and PostgreSQL scripts to liaising with clients for data migration. This experience provided me with valuable insights into database administration, data integrity, and client relationship management.

Strengths
To me, what makes a good software engineer is the ability to see the bigger picture while still paying attention to the details that matter. When you’re working with complex systems made up of many moving parts, you need to be able to zoom out to understand how everything connects, but also zoom in when necessary to tackle specific problems effectively.
Another important quality is being good at debugging, which really means being good at analyzing failures, tracing root causes, and fixing issues systematically. It might sound strange, but I actually enjoy running into bugs because that’s where you really learn how a system works. The more problems you face and solve, the better you get at recognizing patterns and resolving them quickly.
I would also say that I’m easy to work with. Through my internships and work experiences, I’ve worked with people from very different backgrounds and personalities, and I think I have learned what it means to be “easy to work with”: At the workplace, you can really deal with all sorts of nonsense, and you need to deal with that nonsense calmly and professionally.

He keeps his ego out of his work and doesn’t take things personally.
He removes drama from situations instead of adding to it.
He knows when to step back and get out of the way when it helps the bigger picture.
He focuses on what’s within the team’s control instead of getting distracted by what isn’t.
He talks about processes, not people — focusing on fixing issues rather than pointing fingers.

Weakness
One thing I’ve really worked on is my time management and focus, especially when I was starting out. Earlier in my projects, I sometimes got too deep into solving smaller parts of a problem or over-engineering features that didn’t really add value at that stage. It wasn’t about trying to make things perfect, but I’d sometimes spend time on things that weren’t a priority.
When you’re working under tight deadlines, especially for proof-of-concepts or fast-moving projects, you just don’t have that luxury. I remember my manager always telling me I needed to work in an agile way. Back in school, ‘agile’ just sounded like a buzzword, but through experience I came to understand what it really means in practice: knowing what’s good enough, prioritising tasks, failing fast, and iterating quickly.
One thing that really stuck with me was an interview I watched with Jensen Huang, the CEO of NVIDIA. He said it’s crucial to fail fast, to spot when an idea is a dead end, cut your losses, and move on. That mindset really changed how I work.
These days, I make it a point to break problems down properly upfront to avoid unnecessary complexity and technical debt. I keep a clear priority list, focus my time on what truly matters, and ‘swallow the frog’, tackling the hardest or most uncomfortable task first instead of putting it off. I’ve also learned to draw the line between what’s good enough and what actually needs more refinement, so I don’t waste effort on things that don’t move the needle.
Another area I’ve improved is getting out of my comfort zone. Back in university, I kept telling myself I’d pick up front-end or cloud skills ‘one day,’ but I always delayed it. I realised that to keep up in tech, you can’t stand still, if you stop learning, you fall behind. So recently, I’ve been going back to fundamentals, pushing myself to build projects in areas I’m less familiar with, and learning to be comfortable with being uncomfortable.
So in short, my weakness used to be losing focus and not managing my time as well as I could. Now I put more discipline into prioritising what really matters, balancing speed with quality, and staying adaptable by constantly pushing myself to grow.

Behavioural Questions
Tell me about a time you faced a challenge at work.

Situation: At AI Singapore, we often onboarded mid-career professionals from very different backgrounds, so they came in with varying levels of technical experience. In my team, for example, we had one fresh grad, one experienced engineer, and two career switchers.
One challenge I faced was helping the newer team members grasp fundamental concepts that are second nature to someone with more experience. It’s like when a child asks you a simple ‘why’ question, you suddenly realise your own understanding is being tested too. On top of that, I also had to spend quite a bit of time checking and validating their work, which could slow us down if I didn’t find a good approach.

Task: My goal was to get everyone up to speed quickly while keeping our project on schedule and maintaining quality.

Action: To do that, I had to learn how to translate technical ideas into simple, relatable terms. I used analogies wherever I could, I’m a big believer in what Richard Feynman said: ‘If you can’t explain something simply, you don’t really understand it.’ So breaking things down forced me to deepen my own understanding too.
I also created clear onboarding materials and walkthroughs, and even built a small repo with an interactive game to help them practise Linux commands and version control in a hands-on way. On top of that, I put clear CI/CD pipelines in place to standardise checks and reduce human error.

Result: As a result, our onboarding time dropped significantly, the new team members felt more confident, and our deployments became about 80% faster with fewer bugs and less manual work. It also made the team more collaborative because everyone felt comfortable asking questions and contributing ideas.

Describe a situation where you worked with a difficult colleague.
Situation: In my team, I once worked with a colleague who was quite eccentric and, honestly, very emotional at times. In software teams you really do encounter all kinds of personalities, especially when there’s pressure and tight deadlines. When things got stressful or when he felt frustrated with some of our slower colleagues, he would sometimes spiral and throw tantrums that really affected the team’s morale.
Task: My main goal was to maintain a calm and productive work environment so that the project wouldn’t get derailed by unnecessary conflict.
Action: I had to learn to handle this carefully. One thing I’ve realised is that different people respond differently, sometimes it’s really about understanding how they see things and adjusting how you communicate.
So, instead of ignoring it, I tried to really listen to where he was coming from. I talked to him one-on-one to understand his frustrations and pain points. To tackle the root of it, I also suggested we have regular team check-ins, almost like a mini group therapy session, where we’d share updates, talk through blockers, and clarify how our work affected each other.
We made it a point to focus on processes, not people, so no blaming names, just clear ways to work better together. For example, every Thursday we’d do a sync-up to align on components and make sure no one felt out of the loop.

Result: Sometimes these things don’t magically fix everything, and I learned that too. When things didn’t fully improve, I focused on what I could control. I made sure my own work stayed on track, protected my energy, and escalated issues to my manager when necessary. In the end, the team still hit our deadlines, and the situation never escalated into something bigger, but I also learned that sometimes you have to set boundaries and know when it’s not your responsibility to fix everything alone.

Describe your process when you handle difficult situations.
Situation: I’ve seen it many times, people jumping straight into a problem or task without fully understanding it first. That often leads to wasted time, half-baked solutions, or having to redo things later.
Task: When I handle a difficult situation, whether it’s building a new feature or fixing a bug, I see my role as more than just writing code, I want to make sure I’m solving the right problem in the right way, so it actually aligns with the bigger product or business goals.
Action: My first step is always to step back and get the full context. I ask myself:
What exactly is the issue or requirement?
What’s the input, the expected output, and the intended behaviour?
How does this fit with the existing product, systems, data models, or other dependencies?
Who should I talk to for clarity, like product managers, designers, or other engineers?
What’s the priority and the deadline?
Once I have that context, I brainstorm possible approaches and weigh the pros and cons of each, whether that’s technical complexity, time cost, or how much it affects other parts of the system. After picking the best path, I implement it, monitor how it performs, and stay ready to adapt based on feedback or changing circumstances.
Result: Taking time to understand the bigger picture and think critically upfront has helped me avoid unnecessary rework and deliver solutions that actually make sense for the business. I believe this proactive, thoughtful approach is what separates a good engineer from someone who just blindly executes tasks.

Share your leadership style and how it helped you lead a team in your previous role.
Situation: In my previous role, I was effectively the main driving force in my team. We had a mix of people, including career switchers and new graduates, and one challenge was that the team wasn’t very proactive about sharing updates. People weren’t communicating blockers or progress clearly, which often led to miscommunication and double work.

Task: My goal was to keep the project moving while creating a working style where everyone knew what others were doing, so we could avoid silos and unnecessary rework.

Action: My leadership style is quite people-focused. I believe a good leader should take the time to understand each team member’s motivations, strengths, weaknesses, and what they want to learn or achieve, and use that to guide how you delegate tasks and support them.
To lead by example, I started openly sharing what I was working on every day, posting detailed updates in the group chat, explaining what I did, what was done, and what was next. If someone wanted to help out or learn more about a part of the project, they could jump in. Over time, others started doing the same, and it really helped keep everyone aware of what was happening, which reduced silos and duplicate work.

Result: That approach worked well, but one thing I learned along the way is that not everyone wants the same things. Some people are naturally proactive and ambitious; others prefer to just do their part and float along, and some might even feel pressured by too much structure or expectation.
So now, my leadership style is more balanced. I take time to observe the team dynamics first instead of pushing too hard immediately. I let people be accountable for themselves and adapt to each other’s working styles, because you can’t really force someone to change, but you can influence the team culture. I see it as helping the team find its own balance point, its own equilibrium, and stepping in more directly when needed to keep things moving.

Explain how you handled tough decisions in a high-pressure environment?
Situation: During my internship at Tessaract, we were onboarding a major law firm onto our platform. The accountants at the firm weren’t very happy with some parts of our system, they had specific workflows they were used to, and the switch to our software was a big change for them. Meanwhile, the deadline for their launch was very tight and there was a lot of pressure to keep the client happy.

Task: The challenge was to balance the client’s expectations with what we could realistically deliver in time for launch. It was tempting to just say ‘yes’ to every request to keep them satisfied, but that would have created chaos for the team and made the situation worse down the line.

Action: Instead of overpromising, which I’d seen happen in a training session with another colleague, I focused on managing expectations realistically. I explained clearly which features or tweaks we could deliver immediately, which ones would take longer, and why. I also prepared ahead by creating clear plans and documents for the most common issues the accountants might run into during onboarding, like how to handle data migration, reconcile records, or deal with missing fields.
By addressing their pain points directly and showing that we had thought through their concerns, I was able to build trust without having to promise things we couldn’t deliver in time.

Result: As a result, the onboarding went ahead smoothly. Even though the system didn’t cover every request right away, the accountants felt supported and knew exactly what to expect and when. By setting clear boundaries and planning for problems in advance, we avoided last-minute surprises and kept the client relationship strong.

Have you failed at an important task before? What did you learn from it?
At Tessaract, I was helping manage data migrations for clients,  moving large volumes of sensitive information into our production database and developing reports based on that data. One of our biggest challenges was that the client, for confidentiality reasons, didn’t want to share some of their real ground-truth data with us until the very last minute.

This meant we had to make assumptions about the data’s format, structure, and quality to prepare the migration scripts and reports ahead of time.
But when the client finally decided to share with us the real data, very close to the delivery deadline, it turned out to be much messier than we expected: it had lots of formatting issues, inconsistent column names, and plenty of missing values. A lot of the assumptions we had made were thrown out overnight, and we had to scramble to clean and revalidate the data while keeping the migration on track.
We did our best to patch things up, but the last-minute surprises caused delays and extra stress for both us and the client.
Looking back, I’d say that taught me a lot about handling real-world projects where things rarely go exactly as planned, especially when sensitive data and external dependencies are involved.
Now, whenever I work on something similar, I build in more buffer time for the unexpected, push harder for early access to at least sample data if possible, and design my scripts and processes to handle edge cases more flexibly.
So the lesson was that failures or surprises will always come up, but staying adaptable, planning for worst-case scenarios, and validating assumptions early can prevent a small problem from becoming a big one later on.

Any Questions for us?
Can you tell me more about the day-to-day responsibilities of this role?
What are the main challenges currently facing your team or department?
What is your tech stack?
What are the key qualities or skills you're looking for in the ideal candidate for this role?
What aspects of working at PSA do you find most rewarding?

Expedite
I just wanted to let you know that I’m currently in the final stages with another opportunity, and they’ve asked for my decision by [date]. I’m very interested in your role and team, so I wanted to check if it might be possible to expedite the next steps on your end. Of course, I completely understand if that’s not feasible, but I thought it would be fair to let you know where I stand.