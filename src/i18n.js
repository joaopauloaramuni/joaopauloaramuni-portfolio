import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  en: {
    translation: {
      comando: {
        nao_reconhecido: "Command not recognized:",
        ver_ajuda: "Type 'help' to see the options.",
      },
      sobre: {
        nome: "João Paulo Aramuni",
        cargo: "Software Engineering Professor at PUC Minas",
        biografia:
          "Doctor and Master in Information Systems and Knowledge Management from Universidade FUMEC, with a degree in Computer Science. He has 13 years of experience in systems development and 9 years in technology education. He is a professor in the Software Engineering course at PUC Minas, also serving as CTO of the Experimental Software Agency at ICEI. He has been a Tech Lead at Trybe and Tech Manager at IN8, as well as a consultant in artificial intelligence and system architecture. He has experience in team leadership, agile methodologies, design patterns, back-end development (Java and Python), and has participated in projects for companies such as Banco do Brasil, Oi, ANP, Prosegur, HotMilhas, and 123milhas.",
        titulo_skills:
          "Main Skills: Teaching, Leadership and people management, Software development, Agile documentation, Global system deployment, Legacy system maintenance, Design patterns, and Agile methodologies: Scrum and Lean.",
      },
      boasvindas: {
        nome: "Professor",
        titulo: "Aramuni",
        subtitulo: "Prof. Dr. João Paulo Carneiro Aramuni",
        bemvindo: "$ Welcome to my Portfolio",
        cargo1: "Software Engineering Professor at PUC Minas",
        cargo2: "CTO at the Experimental Software Agency",
        formacao1:
          "Doctor and Master in Information Systems and Knowledge Management",
        formacao2: "Bachelor of Computer Science",
        local: "Belo Horizonte, Minas Gerais, Brazil",
        esporte: "Atlético Mineiro Supporter",
        ajuda: "Type `help` to explore all available commands.",
      },
      contato: {
        titulo: "Get in Touch",
        subtitulo: "Feel free to connect or send me a message.",
        nome: "Your name",
        email: "Your email",
        mensagem: "Your message...",
        enviar: "Send",
        voltar_terminal: "Back to terminal",
        sucesso: "✅ Message sent successfully!",
        erro: "❌ Failed to send, please try again.",
      },
      jogo: {
        voltar_terminal: "Back to terminal",
      },
      premios: {
        titulo: "Awards",
        nenhum: "No awards registered yet.",
        link: "See Link",
        professor_newton: {
          titulo: "Outstanding Professor of the Information Systems Course",
          org: "Newton Paiva University Center",
          desc: "Recognition for outstanding performance as a professor of the Information Systems course in the second semester of 2023.",
        },
        patrono_fumec: {
          titulo: "Patron of the Computer Science Class 1SEM/2020",
          org: "FUMEC University",
          desc: "The title of class patron is an honor granted by graduating students. During graduation ceremonies, as part of tradition, students elect a distinguished figure in the scientific field as the 'patron of the class'. This recognition honors the professional, highlighting their work and study admired by the new generation of professionals.",
        },
        premio_prosegur: {
          titulo: "Best Teamwork Award",
          org: "Prosegur",
          desc: "Award granted to Team SOL for the development of the SOL system using Agile Scrum methodology. The team was organized into 3 squads: 2 Scrum teams and 1 support/correction team. The purpose of dedicating a small team to support and corrections was to allow the Scrum teams to remain focused on delivering user stories without interruption. Each sprint lasted 2 weeks, including planning, presentation, and retrospective meetings. This structure allowed continuous development and delivery.",
        },
        segundo_lugar_fumec: {
          titulo: "2nd Place Overall in the Computer Science Course",
          org: "FUMEC University",
          desc: "Recognition granted by FUMEC University for achieving 2nd place overall in the Computer Science Bachelor's degree in 2013. This award reflects consistent academic performance, dedication to studies, and a commitment to technical and scientific excellence.",
        },
      },
      ajuda: {
        titulo: "Available commands:",
        sobre: { desc: "Shows a brief description about me." },
        ajuda: { desc: "Displays this list of available commands." },
        experiencias: {
          desc: "Shows my professional trajectory and experiences.",
        },
        contato: {
          desc: "Displays my contact information and sends an email.",
        },
        limpar: { desc: "Clears the terminal history." },
        recomendacoes: { desc: "Shows my LinkedIn recommendations." },
        premios: { desc: "Shows awards and recognitions." },
        projetos: { desc: "Displays my developed projects." },
        spotify: { desc: "Shows what I'm listening to and recent plays." },
        wakatime: {
          desc: "Shows how much time I spent coding and in which languages.",
        },
        curriculo: {
          desc: "Displays my resume with PDF preview.",
        },
        game: { desc: "Play Flappy Plane directly in the web terminal." },
      },
      projetos: {
        titulo: "My Main Projects",

        python_proj_title: "Python Projects",
        python_proj_desc:
          "Collection of Python projects, including automation, data analysis, web development, and machine learning. They demonstrate practical application of algorithms, API integration, data manipulation, and interactive interface creation, offering solutions from utility tools and file compressors to art generators, simulators, and code metrics analyzers.",

        springboot_proj_title: "Spring Boot Projects",
        springboot_proj_desc:
          "Collection of Java projects with Spring Boot, including REST APIs, integration with SQL and NoSQL databases, JWT authentication, data processing, and web functionalities. They showcase architecture, services with user interfaces, integration with APIs like Huggingface and MercadoPago, file compression, messaging, and secure login, offering a concise backend solutions portfolio.",

        c_proj_title: "C Language Projects",
        c_proj_desc:
          "Collection of projects in C and C++, including algorithms, data structures, recursion, pointers, structs, files, and control flow. Compiled with MinGW/GCC, they range from simple calculators and games to matrix multiplication, file handling, simulations, and sorting algorithms, providing a portfolio of programming fundamentals, logic, efficiency, and best practices.",

        portfolio_proj_title: "Personal Portfolio",
        portfolio_proj_desc:
          "Portfolio in React and Vite that simulates a terminal to navigate projects, experiences, and achievements. Includes components like ProjectCard and ExperienceCard, displaying information dynamically. Supports multiple languages and integrates a mini-game, offering a fun experience. Combines modern design, intuitive navigation, and interactive features.",

        github_proj_title: "GitHub Readme Profile",
        github_proj_desc:
          "Project for building GitHub profiles with personalized READMEs, statistics, badges, activity and contribution charts. Includes integration with WakaTime and Spotify, examples of interactive profiles, best practice guides, dynamic visual elements, and automatic content generation. The goal is to provide a complete and attractive portfolio, highlighting skills and projects.",

        aes_proj1_title: "Landing Page - Experimental Software Agency",
        aes_proj1_desc:
          "The AES Landing Page introduces the agency, collects requests, and highlights projects and team talents. It facilitates communication between clients and developers by allowing direct submission of requests to responsible teams. It also promotes the agency, showcasing projects, achievements, talents, and services, serving as a showcase for the market to see AES’s potential.",

        aes_proj2_title: "Smart Curriculum - Experimental Software Agency",
        aes_proj2_desc:
          "The Smart Curriculum helps students organize their course matrix, providing a graphical view of subjects across periods. It allows rearranging subjects according to preferences, tracking academic progress, exploring courses from other programs, and planning future choices, offering a more complete, personalized, and flexible learning experience.",

        aes_proj3_title: "I Care Well - Experimental Software Agency",
        aes_proj3_desc:
          "I Care Well is a project by PUC Minas, in partnership with the Mário Penna Institute and the PUC Minas Physiotherapy Clinical Center, aimed at supporting the discharge of cancer patients. The app guides patients on physiotherapy practices at home, replacing the paper booklet with a more practical digital solution.",

        aes_proj4_title: "Map of Institutions - Experimental Software Agency",
        aes_proj4_desc:
          "The Map of Institutions project, developed by the Experimental Software Agency of PUC Minas in partnership with Sustainability Intelligence Center (CIS) of BH-TEC, is an initiative aimed at mapping sustainable actions throughout the state of Minas Gerais. The mapping contributes to giving visibility to these initiatives, in addition to providing metrics that support governmental discussions on sustainability.",

        aes_proj5_title: "Help Out App - Experimental Software Agency",
        aes_proj5_desc:
          "Help Out is an app that optimizes the mentorship program of the Software Engineering course at PUC Minas. It centralizes participant information and improves communication between mentors and mentees. Using an advanced matching algorithm, it ensures each mentee is paired with the most suitable mentor, providing a personalized experience.",

        jedis_proj_title: "RHapido 2.0 - Jedis Technology and Recruitment",
        jedis_proj_desc:
          "RHapido 2.0 is a recruitment management system that uses artificial intelligence to streamline and make talent acquisition more efficient. Developed with cutting-edge technology, it offers intelligent resume screening, reducing time and costs in the hiring process.",
      },
      recomendacoes: {
        titulo: "Recommendations",
        nenhum: "No recommendations yet",
        rec1_relationship:
          "On August 31, 2025, Michelle Hanne worked with João Paulo on the same team",

        rec1_recommendation:
          "Aramuni is an excellent educator, committed to the technical and human development of students. He takes care to develop teaching materials as well as workshops that support students. Courses such as Fundamentals of Design, Algorithm Analysis, Software Project, Software Development Labs, among others, are of utmost importance for academic training and for training in Software Engineering. In short, an excellent technical leader and competent teaching professional.",

        rec2_relationship: "On August 5, 2025, Pedro reported to João Paulo",

        rec2_recommendation:
          "I had the honor of working with Aramuni as my undergraduate thesis advisor, and I can confidently say that his mentorship extended far beyond academic guidance. From day one, he fostered an environment of trust, curiosity, and autonomy, encouraging independent thinking while always being available when needed. What impressed me most was his commitment. No matter how busy his schedule was, he consistently made time to meet, provide thoughtful feedback, and check in on my progress. Beyond his role as a thesis advisor, Aramuni is a truly passionate educator. He brings not only deep technical expertise to the table, but also a genuine sense of purpose in teaching and mentoring others.",

        rec3_relationship: "On July 30, 2025, Bernardo reported to João Paulo",

        rec3_recommendation:
          "During the first semester of 2025, I had the privilege of working with Professor Aramuni as my thesis advisor. His guidance was instrumental throughout the process. He gave us the freedom to explore different technologies and encouraged independent thinking, while also providing clear and constructive feedback at every stage. What stood out most was his consistent availability — he always made time for me and my partner, setting up regular meetings and ensuring we felt supported. His calm demeanor and genuine care created a welcoming environment that made it easy for us to grow and develop. Professor Aramuni is an excellent mentor and a remarkable educator.",

        rec4_relationship: "On July 25, 2025, Luca reported to João Paulo",

        rec4_recommendation:
          "Professor Aramuni is one of the most dedicated and inspiring educators I’ve ever had the privilege to learn from. Creative and constantly innovating, he brings not only a deep theoretical foundation to his classes but also a strong focus on real-world application through hands-on exercises, interactive quizzes, and practical projects — many of which are available for free on his GitHub. What truly sets him apart, however, is his availability and genuine care for each student. He consistently makes time for one-on-one meetings, offering mentorship on both academic and career paths. His extensive professional background enriches every class with real-world examples and valuable insights. In my case, the conversations I had with him over the past few months played a key role in shaping important career decisions. Being his student was not just a great academic experience — it was a transformative one.",

        rec5_relationship:
          "On September 19, 2024, Flavio reported to João Paulo",

        rec5_recommendation:
          "For approximately a year, I had the privilege of being a student of Professor João Paulo Aramuni. He stands out not only for his vast technical knowledge but also for the evident passion he has for technology, which shows in each of his classes. His distinctive approach combines engaging and dynamic teaching, making learning more accessible and interesting. Furthermore, his ability to offer individualized attention to each student demonstrates his commitment to the personal and academic development of all, creating an environment where everyone feels valued and encouraged to grow.",

        rec6_relationship: "On August 22, 2024, Pedro reported to João Paulo",

        rec6_recommendation:
          "I had the privilege of being João's student, from whom I learned a lot about databases and Java. He is an excellent teacher, very competent and always willing to help! He demonstrates full mastery of the subjects, transforming complex content into something easy to understand and learn. I strongly recommend him to anyone wishing to deepen their knowledge in these areas. Anyone who has the opportunity to learn from him will be in good hands!",

        rec7_relationship:
          "On August 22, 2024, Angélica and João Paulo studied at the same institution",

        rec7_recommendation:
          "I often say that João was 'bitten by the mosquito' that made us fall in love with teaching. We both loved our careers, which had established us, but even so, teaching called us, and today we are fully fulfilled in this field. Moreover, João is a true partner, always attentive to supporting people he considers talented. I have the privilege of being one of those people. Thanks to João, I realized my dream of teaching at the undergraduate level, and he was so generous that he even gave me his classes. What can I say about such an extraordinary person? João, the world is yours, my friend! Count on me for us to leave our mark on the new 'generation' of IT talent.",

        rec8_relationship:
          "On August 20, 2024, Max and João Paulo studied at the same institution",

        rec8_recommendation:
          "Talking about João Aramuni is easy, I had the privilege of counting on his help on several occasions, and I can confidently say he is an extraordinarily intelligent and collaborative person. His team spirit is simply remarkable, always willing to contribute to collective success. In addition to his professional skills, he has excellent interpersonal relations, being extremely pleasant and respectful. His ability to work well with others and his willingness to share knowledge make him a remarkable person for any team.",

        rec9_relationship:
          "On August 19, 2024, Rubens Gabriel was a client of João Paulo",

        rec9_recommendation:
          "I was fortunate to have Professor João Aramuni as my teacher and thesis advisor. He stands out for making complex concepts more accessible and for his commitment to the development of his students. He was always available to provide guidance and support, which was fundamental for my academic growth. I recommend him to anyone who has the opportunity to work or learn with him.",

        rec10_relationship:
          "On June 19, 2024, João Paulo was senior to Pedro, but did not directly supervise him",

        rec10_recommendation:
          "João Paulo Aramuni is a very good professor. During my time in his class, I was impressed with his deep technical knowledge and his ability to convey complex concepts in a clear and accessible way. His didactic approach encourages active student participation, promoting a collaborative and enriching learning environment. Moreover, his passion for the subject is evident in every class, inspiring his students to strive for academic excellence.",

        rec11_relationship: "On March 1, 2024, Tulio reported to João Paulo",

        rec11_recommendation:
          "I had the pleasure of being led by Aramuni during most of my time at Trybe, and I can affirm that it was an exemplary leadership and an inspiration as a professional. He always cared about the development of his team members, pointing out opportunities within the company for growth and encouraging taking courses and reading books. Whenever I brought observations for improvement in operations, João encouraged me to gather data and document facts to support discussions with higher-level leadership to improve team-wide processes, which led to changes in some tasks carried out by all other instructors and specialists. I strongly recommend him both as a leader and as a technical computing reference.",

        rec12_relationship: "On February 8, 2024, Luíza reported to João Paulo",

        rec12_recommendation:
          "Professor Aramuni is an exceptional educator in the field of Databases. During the time I was his student, I experienced a truly didactic teaching approach, which made all the difference in my academic journey. He not only has deep mastery of the content but also possesses the unique ability to convey complex concepts in a clear and accessible way. His light and fun approach makes the classes engaging, providing a conducive learning environment. Furthermore, his patience and willingness to help students were essential for my academic development. I am certain he will continue to positively impact the lives of his students, just as he did with me.",

        rec13_relationship:
          "On January 30, 2024, Thiago reported to João Paulo",

        rec13_recommendation:
          "Professor João Paulo Aramuni is an excellent teacher! When I started college, I had a lot of difficulty with Java and was developing a dislike/trauma towards the subject, but after his classes, I learned to enjoy it and, with his help, I began to improve and get better constantly. His teaching style is amazing and engaging, demystifying what seems complex and making it simple! He addresses the details and teaches us not only how to do things but also to understand what we are doing. He always gave me tremendous support, even outside of college, and I could always count on him! I am very grateful.",

        rec14_relationship:
          "On December 18, 2023, Carlos reported to João Paulo",

        rec14_recommendation:
          "Working under Aramuni's leadership for 18 months was an incredible experience, both for my professional and personal development. Aramuni proved to be an exceptional leader, providing continuous support and the creative freedom the entire team needed, whether to teach or create high-quality content. With his knowledge of Python, algorithms, and web scraping, Aramuni was a cornerstone in the construction and operation of the computer science module. I learned a lot from him, not only technically but also in becoming a more complete and adaptable professional. I am grateful for all his guidance and consider him a mentor, leader, and friend.",

        rec15_relationship:
          "On November 6, 2023, João Vitor reported to João Paulo",

        rec15_recommendation:
          "As my leader, Aramuni helped me evolve greatly. He brought excellent PDIs, technical discussions, and also outstanding study recommendations. Furthermore, he created opportunities for both less experienced and more experienced team members, fostering confidence in all his direct reports. He has excellent people management skills, and the whole team admired him. I also emphasize that, besides the benefits for the growth and delivery of his team, he maintained a focus on generating value for the business, which led to excellent outcomes. I recommend Aramuni as a leader who can add value both to the company and to his team.",

        rec16_relationship: "On October 25, 2023, Tiago reported to João Paulo",

        rec16_recommendation:
          "Aramuni demonstrates very human leadership, paying great attention to areas of improvement and what is needed to achieve goals. I am very grateful to have been led by him and can say that I grew a lot as a professional and person because he is an excellent listener and highly empathetic. His recommendation is well-deserved because he is an extremely committed and responsible professional, who is not afraid to step up when needed.",

        rec17_relationship: "On June 8, 2023, Eli reported to João Paulo",

        rec17_recommendation:
          "It is a pleasure to recommend Aramuni; he was my leader at Trybe and I also followed his work as Technical Leader of the Computer Science Curriculum. During this period, I witnessed his exceptional skills and his commitment to the success of the team. His unique combination of academic knowledge, practical experience, and leadership skills makes him a remarkable professional. Moreover, he is an incredible person, always willing to help and contribute to others. His guidance and support were essential for my professional growth, both technically and personally. I am extremely grateful for everything I learned from him and proudly recommend him.",

        rec18_relationship: "On May 9, 2023, Cristiano reported to João Paulo",

        rec18_recommendation:
          "Aramuni is a person who demonstrates extreme responsibility in his professional duties and has a gift for relating to people, making the workplace light and pleasant. Personally, he learns processes quickly, is extremely focused on his activities, demonstrates very high technical potential, and is always concerned with his constant evolution, all while maintaining care and attention towards people. I greatly enjoy working with him because I learn a lot and become a better professional through his examples and advice. I am grateful for this daily opportunity for collaboration and sincerely hope to maintain this productive relationship for a long time.",
        rec19_relationship:
          "On March 12, 2023, Will and João Paulo studied at the same institution",

        rec19_recommendation:
          "An excellent opportunity I had to work with Aramuni; I learned a lot from him. After all, it was my first experience teaching Programming, and he taught me so much. Great Professor and Leader, always providing the team with assertive feedback! Thank you, Aramuni!",

        rec20_relationship:
          "On February 7, 2022, João Paulo was senior to André but did not directly supervise him",

        rec20_recommendation:
          "Aramuni is able to organize agendas and bring focus to meetings, keeping the team organized and guided. Additionally, he is super calm and easygoing, and always plays soft music for relaxed moments. A really great person to work with =D",

        rec21_relationship:
          "On August 10, 2021, Douglas reported to João Paulo",

        rec21_recommendation:
          "Having Aramuni as an instructor was one of the best experiences of my life. His advice and guidance made me realize exactly my technological strengths and weaknesses. Today I know where I am headed because I know which path to follow. Patience, calmness, clarity, and teaching strategy gave me the confidence to overcome any challenge that came my way. He is brilliant as an instructor, lead, influencer, and a lifelong friend.",

        rec22_relationship:
          "On October 2, 2020, João Paulo was senior to Bruno but did not directly supervise him",

        rec22_recommendation:
          "I had the pleasure of being João's student and TCC advisee. He is a person who has always made a difference in academia and helped me greatly to become the professional I am today. As I say, brilliant teachers teach for a profession. Fascinating teachers like João teach for life.",

        rec23_relationship:
          "On September 11, 2020, Klelvin worked with João Paulo on the same team",

        rec23_recommendation:
          "I have known João for about 10 years and have shared many life moments with him throughout our careers. He was a college colleague, a work colleague, and became a lifelong friend. Dedicated academic, exemplary educator, and professional with unmatched abilities. I wish every place I worked had a João Paulo.",

        rec24_relationship:
          "On April 25, 2020, Rafael worked with João Paulo on the same team",

        rec24_recommendation:
          "João is an exemplary professional and, given his academic background, is always open to learning new technologies and methods. At the same time, he consistently shares knowledge with everyone.",
        rec25_relationship:
          "On November 17, 2018, Eduardo and João Paulo studied at the same institution",

        rec25_recommendation:
          "I had the pleasure of being João Paulo's student at FUMEC, and he is surely one of the most competent teachers/professionals I have ever met. He always seeks to offer the best to his students, preparing differentiated classes and projects. He is a professional with extensive experience and knowledge.",

        rec26_relationship:
          "On March 27, 2018, Bruno was a client of João Paulo",

        rec26_recommendation:
          "The talents displayed by Professor João are ineffable. Even from the little I know him as a student, his professional and interpersonal qualities are evident. Always available, he shows complete interest in doing excellent work, in this case, transmitting knowledge. If there is anyone I would like as a teammate, it would be João Paulo.",

        rec27_relationship:
          "On March 23, 2018, Leonardo was a client of João Paulo",

        rec27_recommendation:
          "João Paulo is an exceptional teacher, showing that programming goes far beyond syntax. He guides students in their entire quest for knowledge, being not only a teacher but also a companion. Extremely open to answer any questions and help us evolve.",

        rec28_relationship:
          "On March 20, 2018, Rafaela was a client of João Paulo",

        rec28_recommendation:
          "I know João Paulo as 'Professor Aramuni', which was the first time I had contact with him. I can say he is one of the best teachers I have ever had: super dedicated, explains the subject well, and demonstrates complete knowledge of what he teaches. I asked for his help a lot during the course and always received a quick response, which was great! He does everything possible to encourage us to study, talks about job and internship opportunities for those in need, and encourages people to deepen their studies in courses, books, scientific initiation, and even pursue master's and Ph.D. degrees. It was a pleasure to attend his classes, and I hope to work with him in the future!",

        rec29_relationship:
          "On March 19, 2018, Pedro Henrique was a client of João Paulo",

        rec29_recommendation:
          "Excellent teacher! A distinguished master who stays updated with new teaching methodologies! Intrigues and challenges his students to think differently. Always available and attentive!",

        rec30_relationship:
          "On March 19, 2018, Henrique was a client of João Paulo",

        rec30_recommendation: "Excellent teacher, with energy and patience!",
        rec31_relationship:
          "On March 19, 2018, Rubens was a client of João Paulo",

        rec31_recommendation:
          "João Paulo is the type of teacher who ensures that students truly understand the subject, both through his teaching methods and his demeanor in the classroom. He demonstrates great knowledge in his field and is willing to understand and assist each student individually, breaking away from the stereotype of a university professor who merely 'points you to the path of learning'.",

        rec32_relationship:
          "On March 19, 2018, Vicente was a client of João Paulo",

        rec32_recommendation:
          "As a teacher, João Paulo became fundamental in my education, since I learned programming in depth. He stands out by not teaching just the basics, but what is actually required in practice and in the job market! His concern and care for each student's learning is a strong point, and he spares no effort to ensure students are well-prepared and able to stand out professionally. His experience in the job market gives us confidence in what he teaches and makes learning easier when he shares real problems he has faced throughout his career. I am grateful to have a teacher of this caliber in my academic formation.",

        rec33_relationship:
          "On March 19, 2018, Igor was a client of João Paulo",

        rec33_recommendation:
          "João Paulo is a great teacher. Dedicated, he always attends to us in the best possible way. He has a modern teaching methodology that is compatible with the requirements of the job market.",

        rec34_relationship:
          "On February 15, 2018, Felipe Ferreira reported to João Paulo",

        rec34_recommendation:
          "João Paulo is a highly motivated and enthusiastic teacher. He shows exceptional care in preparing teaching materials, always clear and up-to-date. His classes are participatory, charismatic, and dynamic. Outside of class, he is attentive and motivating, sharing market experience and valuable advice. One of the best teachers I have ever had and a great friend.",

        rec35_relationship:
          "On December 28, 2017, Gabriel reported to João Paulo",

        rec35_recommendation:
          "João is an excellent teacher, making every class interesting. He is also able to convey information simply and consistently challenges his students to learn more.",

        rec36_relationship:
          "On December 19, 2017, Thiago Brito and João Paulo studied at the same institution",

        rec36_recommendation:
          "Excellent teacher, always concerned with students' learning, while providing good materials and study tips. Also an outstanding person, remembering names and staying close to students. I am grateful for the opportunity to have him as my teacher.",
        rec37_relationship:
          "On December 17, 2017, Gabriel and João Paulo studied at the same institution",

        rec37_recommendation:
          "He is among the best teachers I have ever had. While he challenges you a lot, he also makes you genuinely interested in the subject, clears any doubts, and is someone you want to carry as a friend for life. Simply sensational. I greatly appreciate all the knowledge he has already shared and continues to share.",

        rec38_relationship:
          "On December 15, 2017, Amanda was a client of João Paulo",

        rec38_recommendation:
          "Excellent teacher, attentive, highly knowledgeable, and has good teaching skills.",

        rec39_relationship:
          "On December 14, 2017, Nilson Junio Paulino was a client of João Paulo",

        rec39_recommendation:
          "Excellent teacher, dedicated to every subject he teaches, always seeks knowledge beyond the books, and has excellent teaching skills. I hope to be his student in another subject, as I know it will be well taught.",

        rec40_relationship:
          "On December 13, 2017, Lucas was a client of João Paulo",

        rec40_recommendation:
          "Despite the difficulties during the semester and the numerous bugs we had to fix, it was possible to deliver a project that applied all the theory and concepts taught in an excellent way. I can confidently say that Professor João Paulo will be a key part of my education, playing a fundamental role in my knowledge journey.",

        rec41_relationship:
          "On December 13, 2017, Luiz Guilherme was a client of João Paulo",

        rec41_recommendation:
          "I was fortunate to participate in two courses taught by Professor João Paulo Aramuni, Theoretical Foundations of Computing and Compilers. In both, he showed complete dedication to answering questions, helping students with difficulties, and always had patience and understanding. His classes have dynamics that facilitate understanding and learning, with full mastery of the subjects and practical examples.",

        rec42_relationship:
          "On December 13, 2017, João Paulo was a client of David",

        rec42_recommendation:
          "Excellent teacher, great teaching skills, and a strong desire to teach. The classes were very well conducted!",
        rec43_relationship:
          "On December 11, 2017, João Paulo was senior to Samuel, but did not directly supervise him",

        rec43_recommendation:
          "Professor Aramuni is one of the best teachers I have ever had. His teaching style can explain even the most complex abstractions clearly, enabling everyone to absorb knowledge and solve complex problems. There is no better person for guidance than João Paulo.",

        rec44_relationship:
          "On June 19, 2017, João Lucas Veloso was a client of João Paulo",

        rec44_recommendation:
          "João is a teacher who seeks and develops methods to help his students learn. He has always shown commitment to assisting, providing well-prepared materials and patience to respect each student's pace.",

        rec45_relationship:
          "On February 9, 2017, Fábio and João Paulo studied at the same institution",

        rec45_recommendation:
          "Great teacher, attentive, and highly knowledgeable in what he teaches. His classes were extremely valuable, and his teaching went beyond expectations. I am glad to have shared learning experiences with him.",

        rec46_relationship:
          "On January 9, 2017, Márcio worked with João Paulo on the same team",

        rec46_recommendation:
          "I have worked with João Paulo for about a year and can say he is a very dedicated, responsible, and studious professional. He always seeks knowledge and shares solutions with the team, promoting everyone's growth.",

        rec47_relationship:
          "On October 17, 2016, Felipe and João Paulo studied at the same institution",

        rec47_recommendation:
          "I had the great pleasure of being a student of João Paulo at FUMEC University. Top-notch professor, competent, attentive, relaxed, able to explain complex subjects clearly and simply. All of this thanks to his love for what he does. Wishing you great success, João!",

        rec48_relationship:
          "On October 10, 2016, Bruno was a client of João Paulo",

        rec48_recommendation:
          "I had the pleasure of being a student of João Aramuni at FUMEC University. A serious and dedicated professional, he can convey programming knowledge in a structured and clear way. Excellent teacher, and I hope he stands out greatly in his academic career.",
        rec49_relationship:
          "On August 23, 2015, Rafael and João Paulo studied at the same institution",

        rec49_recommendation:
          "I had the opportunity to study with João Paulo at FUMEC. A distinguished professional: organized, persistent, self-taught, and passionate about agile methodologies. He stood out for his communication skills and knowledge sharing.",

        rec50_relationship:
          "On March 4, 2015, Gabriela and João Paulo studied at the same institution",

        rec50_recommendation:
          "I recommend João for his competence, passion for his field, determination, strong will, and easy-going personality. An excellent professional.",

        rec51_relationship:
          "On November 10, 2014, João Paulo was senior to Glaydson, but did not directly supervise him",

        rec51_recommendation:
          "I have worked with João Paulo for almost a year, and during this period he proved to be a competent and dedicated professional, performing exceptionally on projects for clients such as OI and ANP.",

        rec52_relationship:
          "On November 9, 2014, Lucas and João Paulo studied at the same institution",

        rec52_recommendation:
          "João is a dedicated and proactive student. He stood out in class with excellent assignments and presentations. As a speaker, he addresses agile methodologies in a way that increasingly captivates students.",

        rec53_relationship:
          "On October 29, 2014, Andre worked with João Paulo but on different teams",

        rec53_recommendation:
          "I had the opportunity to work with João Paulo at Capgemini for one year. A professional focused on sharing information and always willing to help.",

        rec54_relationship:
          "On October 14, 2014, Amadeu and João Paulo studied at the same institution",

        rec54_recommendation:
          "João Paulo is deeply involved in classroom and research activities. We worked together on articles and presentations, always bringing innovative ideas. He has experience with agile methodologies, applied even in his master's dissertation.",
      },
      experiencias: {
        titulo: "Professional Experiences",

        // Companies
        puc_minas: "PUC Minas",
        centro_newton_paiva: "Newton Paiva University Center",
        in8: "IN8",
        trybe: "Trybe",
        xp_educacao: "XP Educação",
        universidade_fumec: "FUMEC University",
        prosegur: "Prosegur",
        capgemini: "Capgemini",
        banco_brasil: "Banco do Brasil",
        alamo_ti: "Álamo - IT Solutions",
        cpd_face_fumec: "CPD FACE/FUMEC",
        pibic_cnpq: "PIBIC/CNPq",

        // Roles
        professor_puc: "Professor",
        professor_newton: "Professor",
        tech_manager_in8: "Tech Manager",
        dev_backend_in8: "Senior Back-End Developer",
        curriculum_tech_lead_trybe: "Curriculum Tech Lead",
        curriculum_lead_tech_trybe: "Curriculum Lead & Tech",
        cs_lead_instructor_trybe: "Computer Science Lead Instructor",
        backend_cs_lead_instructor_trybe: "Back-End & CS Lead Instructor",
        cs_specialist_instructor_trybe:
          "Computer Science Specialist Instructor",
        professor_xp: "Professor",
        professor_fumec: "Professor",
        analista_sistemas_pl_prosegur: "Mid-level Systems Analyst",
        analista_sistemas_pl_capgemini: "Mid-level Systems Analyst",
        analista_sistemas_jr_capgemini: "Junior Systems Analyst",
        programador_sr_capgemini: "Senior Programmer",
        programador_jr_capgemini: "Junior Programmer",
        tecnico_programador_bb: "Technician/Programmer",
        desenvolvedor_csharp_alamo: "C# Developer",
        estagiario_fumec: "Intern",
        bolsista_pibic: "Undergraduate Research Fellow",

        // Descriptions & Skills
        professor_puc_desc:
          "In the Software Engineering course, teaches Project and Algorithm Analysis, Software Project, Software Development Lab, Software Experimentation Lab, and Interdisciplinary Work: Applications for Real Scenarios. Guided TCCII projects and leads the ICEI Experimental Software Agency with 6 teams (~30 people). Conducts workshops and lectures on Python, Spring Boot, Docker, PostgreSQL, MongoDB, Cloud, AI, and more, creating technical content and support material.",
        professor_puc_skills:
          "Teaching, Leadership, Software development, Agile documentation, Global system deployment, Legacy system maintenance, Design patterns, Agile methodologies.",

        professor_newton_desc:
          "Teaches Programming Languages (Java), Web Application Architecture, and Databases for Computer Science, Information Systems, and Systems Analysis courses. Highlight professor for the Information Systems course (2nd semester 2023). Teaches logic programming with games (Scratch) for high school students.",
        professor_newton_skills:
          "Teaching, Java, Web application architecture, Databases, Logic programming with games.",

        tech_manager_in8_desc:
          "Leads squads responsible for multiple system development projects for the airline miles market. Ensures continuous execution, demand alignment, and obstacle resolution. Responsible for availability, scalability, performance, security, technical integration with product, data, and business, client communication, hiring, and team mentoring. Tech Stack: Node.js, Next.js, Python, FastAPI, AWS, Docker, Redis, Amazon SQS, GitLab, Grafana, New Relic.",
        tech_manager_in8_skills:
          "Technology project management, Effective communication, Problem solving, Technical leadership, Node.js, Next.js, Python, FastAPI, AWS, Docker, CI/CD, System monitoring.",

        dev_backend_in8_desc:
          "Web scraping and crawler development in Python 3 for airline mileage programs. Creation and maintenance of RESTful APIs for data extraction and browser automation. AWS cloud architecture with HA/DR, CI/CD, Docker container management, and monitoring with Grafana and New Relic.",
        dev_backend_in8_skills:
          "Python, Web Scraping, RESTful APIs, AWS, Docker, CI/CD, Observability and monitoring.",

        curriculum_tech_lead_trybe_desc:
          "Responsible for the Python curriculum structure and technical team development. Data-driven decision making to maximize student employability. Team training, technical guidance, content production, and evaluation tool development.",
        curriculum_tech_lead_trybe_skills:
          "Technical leadership, Computer Science, Python, Team management, Content production, Educational evaluation.",

        curriculum_lead_tech_trybe_desc:
          "Manages the Python curriculum structure and leads a team of 3 people. Defines OKRs and KPIs, produces technical content in Python and Java, and directly mentors the team.",
        curriculum_lead_tech_trybe_skills:
          "Content management, Python, Java, Team leadership, OKR and KPI definition.",

        cs_lead_instructor_trybe_desc:
          "Manages learning operations of classes and a team of 10 people. Defines OKRs and KPIs, conducts selection processes, and directly leads CS instructors and specialists.",
        cs_lead_instructor_trybe_skills:
          "Team leadership, Computer Science, Technical leadership, OKR and KPI definition.",

        backend_cs_lead_instructor_trybe_desc:
          "Manages learning operations of classes and a team of 17 people. Defines OKRs and KPIs, conducts selection processes, and directly leads Back-End and CS instructors.",
        backend_cs_lead_instructor_trybe_skills:
          "Team leadership, Back-End, Computer Science, Technical leadership, OKR and KPI definition.",

        cs_specialist_instructor_trybe_desc:
          "Taught Python, OOP, Web Scraping, algorithms, and data structures. Contributed to the first version of Trybe's Computer Science curriculum. Instructor for Trybe's first cohort (Cohort 1).",
        cs_specialist_instructor_trybe_skills:
          "Teaching, Computer Science, Python, JavaScript, OOP, Web Scraping, Algorithms and Data Structures.",

        professor_xp_desc:
          "Professor of Software Architecture and Requirements Engineering. Introduced fundamental concepts, practices, and tools used in software architectural projects, developing hard and soft skills for high-level software architects.",
        professor_xp_skills:
          "Teaching, Software Architecture, Requirements Engineering, Java, C++, VBScript, Shell Script.",

        professor_fumec_desc:
          "Teaches Computer Science Fundamentals, Compilers, and OOP. Also teaches Script Development I & II in Computer Networks, Software Engineering II, and Introduction to Web Programming. Advises monographs, coordinates extension projects, and guides students for internships and job market.",
        professor_fumec_skills:
          "Teaching, Computer Science Fundamentals, Compilers, OOP, Software Engineering, Web Programming, Script Development.",

        analista_sistemas_pl_prosegur_desc:
          "Developed distributed systems in Java 8, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink. Global deployment. Global software maintenance, refactoring, and performance improvements. WebServices and automated testing. Oracle DB handling. PL/SQL programming. Use case documentation. Agile Scrum methodology.",
        analista_sistemas_pl_prosegur_skills:
          "Java, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink, PL/SQL, Oracle, Scrum, Automated testing.",

        analista_sistemas_pl_capgemini_desc:
          "Analysis and development in Java / Java Web; Maintenance of VB6 / VB.NET systems. Web development with Classic ASP / ASP.NET. Database management with SQLServer / Oracle. Programming with PL/SQL. Documentation and UML. Agile methodology using Lean Manufacturing.",
        analista_sistemas_pl_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        analista_sistemas_jr_capgemini_desc:
          "Analysis and development in Java / Java Web; Maintenance of VB6 / VB.NET systems. Web development with Classic ASP / ASP.NET. Database management with SQLServer / Oracle. Programming with PL/SQL. Documentation and UML. Agile methodology using Lean Manufacturing.",
        analista_sistemas_jr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_sr_capgemini_desc:
          "Second time in Capgemini Brazil's history that a progression from Junior to Senior occurred, skipping the Mid-level position.",
        programador_sr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_jr_capgemini_desc:
          "Development and maintenance of SIGEP and SIMP systems for ANP (National Agency of Petroleum, Natural Gas, and Biofuels), focusing on web applications, document processing, and regulatory compliance support.",
        programador_jr_capgemini_skills:
          "ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        tecnico_programador_bb_desc:
          "Supervised internship in development and support of Java / Java Web applications; Maintenance of SISBB-integrated systems. Development and support of legacy VBA / VB6 applications; PL/SQL programming; Requirements gathering.",
        tecnico_programador_bb_skills:
          "Java, Java Web, VBA, VB6, PL/SQL, Banking automation.",

        desenvolvedor_csharp_alamo_desc:
          "C# /.NET v3.5 development for project management system and electronic time control. Web development with ASP.NET. Version control with TortoiseCVS. SQL Server DB handling. Creation of procedures and triggers.",
        desenvolvedor_csharp_alamo_skills:
          "C#, ASP.NET, SQL Server, Procedures, Triggers.",

        estagiario_fumec_desc:
          "Internship at CPD FACE/FUMEC: Developed internal applications with PHP and jQuery. Network support. Linux server maintenance. Shell scripting. Help Desk.",
        estagiario_fumec_skills:
          "PHP, jQuery, Shell Script, Networks, Linux, Help Desk.",

        bolsista_pibic_desc:
          "PIBIC/CNPq Undergraduate Research Fellow in a project using atomic force microscopy to study interactions of polyphenolic compounds with cells and HTLV-1 virus. Conducted at UFMG and CETEC under Prof Dr Orlando Abreu Gomes.",
        bolsista_pibic_skills:
          "Scientific research, Atomic Force Microscopy, Cell Biology, Virology, Scientific documentation, Academic research support",
      },
    },
  },
  pt: {
    translation: {
      comando: {
        nao_reconhecido: "Comando não reconhecido:",
        ver_ajuda: "Digite 'ajuda' para ver as opções.",
      },
      sobre: {
        nome: "João Paulo Aramuni",
        cargo: "Professor de Engenharia de Software na PUC Minas",
        biografia:
          "Doutor e mestre em Sistemas de Informação e Gestão do Conhecimento pela Universidade FUMEC, com graduação em Ciência da Computação. Possui 13 anos de experiência em desenvolvimento de sistemas e 9 anos no ensino de tecnologia. É professor do curso de Engenharia de Software da PUC Minas, atuando também como CTO da Agência Experimental de Software do ICEI. Já foi Tech Lead na Trybe e Tech Manager na IN8, além de atuar como consultor em inteligência artificial e arquitetura de sistemas. Tem experiência em liderança de equipes, metodologias ágeis, design patterns, desenvolvimento back-end (Java e Python) e participou de projetos para empresas como Banco do Brasil, Oi, ANP, Prosegur, HotMilhas e 123milhas.",
        titulo_skills:
          "Principais Habilidades: Docência, Liderança e gestão de pessoas, Desenvolvimento de software, Documentação ágil, Implantação de sistemas em âmbito global, Manutenção de sistemas legados, Design patterns e Metodologias ágeis: Scrum e Lean.",
      },
      boasvindas: {
        nome: "Professor",
        titulo: "Aramuni",
        subtitulo: "Prof. Dr. João Paulo Carneiro Aramuni",
        bemvindo: "$ Boas-vindas ao meu Portfólio",
        cargo1: "Professor de Engenharia de Software na PUC Minas",
        cargo2: "CTO na Agência Experimental de Software",
        formacao1:
          "Doutor e Mestre em Sistemas de Informação e Gestão do Conhecimento",
        formacao2: "Bacharel em Ciência da Computação",
        local: "Belo Horizonte, Minas Gerais, Brasil",
        esporte: "Torcedor do Clube Atlético Mineiro",
        ajuda: "Digite `ajuda` para conhecer mais sobre os comandos.",
      },
      contato: {
        titulo: "Entre em Contato",
        subtitulo:
          "Sinta-se à vontade para se conectar ou me enviar uma mensagem.",
        nome: "Seu nome",
        email: "Seu email",
        mensagem: "Sua mensagem...",
        enviar: "Enviar",
        voltar_terminal: "Voltar ao terminal",
        sucesso: "✅ Mensagem enviada com sucesso!",
        erro: "❌ Erro ao enviar, tente novamente.",
      },
      jogo: {
        voltar_terminal: "Voltar ao terminal",
      },
      premios: {
        titulo: "Prêmios",
        nenhum: "Nenhum prêmio cadastrado ainda.",
        link: "Ver no Link",
        professor_newton: {
          titulo: "Professor destaque do curso de Sistemas de Informação",
          org: "Centro Universitário Newton Paiva",
          desc: "Reconhecimento pelo excelente desempenho como docente do curso de Sistemas de Informação, no segundo semestre de 2023.",
        },
        patrono_fumec: {
          titulo: "Patrono da turma de Ciência da Computação 1SEM/2020",
          org: "Universidade FUMEC",
          desc: "A atribuição do termo patrono está relacionada com o ato de outorga do grau acadêmico. Nas cerimônias de colação de grau, como parte de uma tradição, os alunos formandos devem eleger uma personalidade de destaque no campo científico a que pertencem como 'padrinho da turma'. O título de patrono é uma honra para o profissional que o recebe, pois significa que seu trabalho e estudo são reconhecidos e admirados pela nova geração de profissionais.",
        },
        premio_prosegur: {
          titulo: "Mejor Trabajo en Equipo",
          org: "Prosegur",
          desc: "Prêmio concedido ao Equipo SOL pelo desenvolvimento dos evolutivos do sistema SOL utilizando a metodologia ágil Scrum. A equipe foi organizada em 3 squads: 2 times Scrum e 1 time de suporte/correções. O objetivo de dedicar uma equipe menor ao suporte e correções era permitir que os times Scrum permanecessem focados nas entregas das user stories. Cada sprint tinha duração de 2 semanas, incluindo planejamento, apresentação e retrospectiva. Esta estrutura permitiu desenvolvimento e entrega contínua.",
        },
        segundo_lugar_fumec: {
          titulo: "2º Lugar geral do curso de Ciência da Computação",
          org: "Universidade FUMEC",
          desc: "Reconhecimento concedido pela Universidade FUMEC pelo 2º lugar geral no curso de Bacharelado em Ciência da Computação no ano de 2013. Este resultado reflete desempenho acadêmico consistente, dedicação aos estudos e compromisso com a excelência técnica e científica.",
        },
      },
      ajuda: {
        titulo: "Comandos disponíveis:",
        sobre: { desc: "Mostra uma breve descrição sobre mim." },
        ajuda: { desc: "Mostra esta lista de comandos disponíveis." },
        experiencias: {
          desc: "Mostra minha trajetória profissional e experiências.",
        },
        contato: { desc: "Exibe minhas informações de contato e envia email." },
        limpar: { desc: "Limpa o histórico do terminal." },
        recomendacoes: { desc: "Exibe minhas recomendações do LinkedIn." },
        premios: { desc: "Exibe prêmios e reconhecimentos." },
        projetos: { desc: "Exibe meus projetos desenvolvidos." },
        spotify: { desc: "Mostra o que estou ouvindo e últimas reproduções." },
        wakatime: {
          desc: "Mostra quanto tempo passei programando e em quais linguagens.",
        },
        curriculo: {
          desc: "Exibe meu currículo com visualização em PDF.",
        },
        game: { desc: "Jogue o Flappy Plane diretamente no terminal web." },
      },
      projetos: {
        titulo: "Meus Principais Projetos",

        python_proj_title: "Projetos Python",
        python_proj_desc:
          "Coleção de projetos em Python, incluindo automação, análise de dados, desenvolvimento web e aprendizado de máquina. Mostram aplicação prática de algoritmos, integração com APIs, manipulação de dados e criação de interfaces interativas, oferecendo soluções de ferramentas utilitárias, compressores, geradores de arte, simuladores e analisadores de métricas de código.",

        springboot_proj_title: "Projetos Spring Boot",
        springboot_proj_desc:
          "Coleção de projetos em Java com Spring Boot, incluindo APIs REST, integração com bancos SQL e NoSQL, autenticação JWT, processamento de dados e funcionalidades web. Mostram arquitetura, serviços com interface de usuário, integração com APIs como Huggingface e MercadoPago, compressão de arquivos, mensageria e login seguro, oferecendo portfólio conciso de soluções backend.",

        c_proj_title: "Projetos Linguagem C",
        c_proj_desc:
          "Coleção de projetos em C e C++, incluindo algoritmos, estruturas de dados, recursão, ponteiros, structs, arquivos e controle de fluxo. Compilados com MinGW/GCC, vão de calculadoras e jogos simples até multiplicação de matrizes, manipulação de arquivos, simulações e algoritmos de ordenação, oferecendo portfólio de fundamentos da programação, lógica, eficiência e boas práticas.",

        portfolio_proj_title: "Portfólio Pessoal",
        portfolio_proj_desc:
          "Portfólio em React e Vite que simula um terminal para navegar entre projetos, experiências e premiações. Inclui componentes como ProjectCard e ExperienceCard, exibindo informações de forma dinâmica. Suporta múltiplos idiomas e integra mini-jogo, oferecendo experiência divertida. Combina design moderno, navegação intuitiva e funcionalidades interativas.",

        github_proj_title: "GitHub Readme Profile",
        github_proj_desc:
          "Projeto para construção de perfis no GitHub, com READMEs personalizados, estatísticas, badges, gráficos de atividade e contribuições. Inclui integração com WakaTime e Spotify, exemplos de perfis interativos, guias de boas práticas, elementos visuais dinâmicos e geração automática de conteúdo. Objetivo é fornecer portfólio completo e atraente, destacando habilidades e projetos.",

        aes_proj1_title: "Landing Page - Agência Experimental de Software",
        aes_proj1_desc:
          "A Landing Page da AES apresenta a agência, capta demandas e destaca projetos e talentos das equipes. Facilita a comunicação entre clientes e desenvolvedores, oferecendo envio direto de demandas às equipes responsáveis. Também divulga a agência, mostrando projetos, conquistas, talentos e serviços, funcionando como uma vitrine para o mercado conhecer o potencial da AES.",

        aes_proj2_title: "Grade Inteligente - Agência Experimental de Software",
        aes_proj2_desc:
          "A Grade Inteligente ajuda alunos a organizar sua matriz curricular, oferecendo visualização gráfica das disciplinas ao longo dos períodos. Permite reorganizar matérias conforme preferências, acompanhar progresso acadêmico, explorar disciplinas de outros cursos e planejar escolhas futuras, proporcionando uma experiência de aprendizado mais completa, personalizada e flexível.",

        aes_proj3_title: "Cuido Bem - Agência Experimental de Software",
        aes_proj3_desc:
          "O CuidoBem é um projeto da PUC Minas, em parceria com o Instituto Mário Penna e o Centro Clínico de Fisioterapia, que visa apoiar a desospitalização de pacientes com câncer. O aplicativo orienta os pacientes sobre práticas fisioterapêuticas em casa, substituindo a cartilha de papel por uma solução digital mais prática.",

        aes_proj4_title:
          "Mapa de Instituições - Agência Experimental de Software",
        aes_proj4_desc:
          "O projeto Mapa de Instituições, desenvolvido pela Agência Experimental de Software da PUC Minas em parceria com o Centro de Inteligência em Sustentabilidade (CIS) do BH-TEC, é uma iniciativa voltada ao mapeamento de ações sustentáveis em todo o estado de Minas Gerais. O mapeamento contribui para dar visibilidade a essas iniciativas, além de fornecer métricas que subsidiam discussões governamentais sobre sustentabilidade.",

        aes_proj5_title: "Ajuda-aí App - Agência Experimental de Software",
        aes_proj5_desc:
          "O Ajuda-aí é um aplicativo que otimiza o programa de apadrinhamento do curso de Engenharia de Software da PUC Minas. Centraliza informações dos participantes e melhora a comunicação entre padrinhos e apadrinhados. Com algoritmo de match avançado, garante que cada apadrinhado seja combinado com o padrinho mais adequado, oferecendo uma experiência personalizada.",

        jedis_proj_title: "RHapido 2.0 - Jedis Tecnologia e Recrutamento",
        jedis_proj_desc:
          "O Rhapido 2.0 é um sistema de gestão de processos seletivos que utiliza inteligência artificial para agilizar e tornar mais eficiente o recrutamento de novos talentos. Desenvolvido com tecnologia de ponta, o sistema oferece uma triagem inteligente de currículos, reduzindo o tempo e o custo do processo seletivo.",
      },
      recomendacoes: {
        titulo: "Recomendações",
        nenhum: "Nenhuma recomendação cadastrada ainda.",

        rec1_relationship:
          "Em 31 de agosto de 2025, Michelle Hanne trabalhava com João Paulo na mesma equipe",

        rec1_recommendation:
          "Aramuni é um excelente docente, comprometido com o desenvolvimento técnico e humano dos alunos. Se preocupa em desenvolver material didático, bem como oficinas que dão suporte aos alunos. Disciplinas como Fundamentos de Projeto, Análise de Algoritmos, Projeto de Software, Laboratórios de Desenvolvimento de Software entre outras, são de suma importância para a formação acadêmica e para formação em Engenharia de Software. Enfim, excelente líder técnico e competente profissional docente.",

        rec2_relationship:
          "Em 5 de agosto de 2025, Pedro respondia a João Paulo",

        rec2_recommendation:
          "I had the honor of working with Aramuni as my undergraduate thesis advisor, and I can confidently say that his mentorship extended far beyond academic guidance. From day one, he fostered an environment of trust, curiosity, and autonomy, encouraging independent thinking while always being available when needed. What impressed me most was his commitment. No matter how busy his schedule was, he consistently made time to meet, provide thoughtful feedback, and check in on my progress. Beyond his role as a thesis advisor, Aramuni is a truly passionate educator. He brings not only deep technical expertise to the table, but also a genuine sense of purpose in teaching and mentoring others.",

        rec3_relationship:
          "Em 30 de julho de 2025, Bernardo respondia a João Paulo",

        rec3_recommendation:
          "During the first semester of 2025, I had the privilege of working with Professor Aramuni as my thesis advisor. His guidance was instrumental throughout the process. He gave us the freedom to explore different technologies and encouraged independent thinking, while also providing clear and constructive feedback at every stage. What stood out most was his consistent availability — he always made time for me and my partner, setting up regular meetings and ensuring we felt supported. His calm demeanor and genuine care created a welcoming environment that made it easy for us to grow and develop. Professor Aramuni is an excellent mentor and a remarkable educator.",

        rec4_relationship:
          "Em 25 de julho de 2025, Luca respondia a João Paulo",

        rec4_recommendation:
          "Professor Aramuni is one of the most dedicated and inspiring educators I’ve ever had the privilege to learn from. Creative and constantly innovating, he brings not only a deep theoretical foundation to his classes but also a strong focus on real-world application through hands-on exercises, interactive quizzes, and practical projects — many of which are available for free on his GitHub. What truly sets him apart, however, is his availability and genuine care for each student. He consistently makes time for one-on-one meetings, offering mentorship on both academic and career paths. His extensive professional background enriches every class with real-world examples and valuable insights. In my case, the conversations I had with him over the past few months played a key role in shaping important career decisions. Being his student was not just a great academic experience — it was a transformative one.",

        rec5_relationship:
          "Em 19 de setembro de 2024, Flavio respondia a João Paulo",

        rec5_recommendation:
          "Durante aproximadamente um ano, tive o privilégio de ser aluno do professor João Paulo Aramuni. Ele se destaca não apenas pelo vasto conhecimento técnico, mas pela evidente paixão que nutre pela tecnologia, a qual transparece em cada uma de suas aulas. Sua abordagem diferenciada combina uma didática envolvente e dinâmica, que torna o aprendizado mais acessível e interessante. Além disso, sua capacidade de oferecer uma atenção individualizada a cada aluno demonstra seu compromisso com o desenvolvimento pessoal e acadêmico de todos, criando um ambiente onde cada um se sente valorizado e estimulado a crescer.",

        rec6_relationship:
          "Em 22 de agosto de 2024, Pedro respondia a João Paulo",

        rec6_recommendation:
          "Tive o privilégio de ser aluno do João, com quem aprendi muito sobre banco de dados e Java. Ele é um excelente mestre, muito competente e sempre disposto a ajudar! Ele demonstra total domínio das matérias, transformando conteúdos complexos em algo fácil de entender e aprender. Recomendo-o fortemente a qualquer um que deseje se aprofundar nessas áreas. Qualquer um que tenha a oportunidade de aprender com ele estará em boas mãos!",

        rec7_relationship:
          "Em 22 de agosto de 2024, Angélica e João Paulo estudavam na mesma instituição",

        rec7_recommendation:
          "Costumo dizer que o João foi 'picado pelo mosquito' que nos fez apaixonar pela docência. Ambos amávamos nossas carreiras, que nos consolidaram, mas, mesmo assim, a docência nos chamou, e hoje somos plenamente realizados nessa área. Além disso, o João é um verdadeiro parceiro, sempre atento a apoiar as pessoas que ele considera talentosas. Tenho o privilégio de ser uma dessas pessoas. Graças ao João, realizei o sonho de lecionar na graduação, e ele foi tão generoso que até me cedeu suas turmas. O que posso dizer de uma pessoa tão extraordinária? João, o mundo é seu, meu amigo! Conte comigo para deixarmos nossa marca na nova 'safra' de talentos em TI.",

        rec8_relationship:
          "Em 20 de agosto de 2024, Max e João Paulo estudavam na mesma instituição",

        rec8_recommendation:
          "Falar do João Aramuni é tarefa fácil, tive o privilégio de contar com sua ajuda em diversas ocasiões, e posso afirmar com segurança que ele é uma pessoa extraordinariamente inteligente e colaborativa. Seu espírito de equipe é simplesmente notável, sempre disposto a contribuir para o sucesso coletivo. Além de suas habilidades profissionais, ele possui um excelente convívio, sendo uma pessoa extremamente agradável e respeitosa. Sua capacidade de trabalhar bem com os outros e sua disposição em compartilhar conhecimentos fazem dele uma pessoa notável para qualquer equipe.",

        rec9_relationship:
          "Em 19 de agosto de 2024, Rubens Gabriel era cliente de João Paulo",

        rec9_recommendation:
          "Tive a sorte de ter o Professor João Aramuni como meu professor e orientador de TCC. Ele se destaca por tornar conceitos complexos mais acessíveis e por seu compromisso com o desenvolvimento dos seus alunos. Ele sempre esteve disponível para oferecer orientação e apoio, o que foi fundamental para o meu crescimento acadêmico. Recomendo para qualquer pessoa que tenha a oportunidade de trabalhar ou aprender com ele.",

        rec10_relationship:
          "Em 19 de junho de 2024, João Paulo era sênior em relação a Pedro, mas não supervisionava Pedro diretamente",

        rec10_recommendation:
          "João Paulo Aramuni é um professor muito bom, durante meu tempo em sua classe, fiquei impressionado com seu profundo conhecimento técnico e sua habilidade em transmitir conceitos complexos de forma clara e acessível. Sua abordagem didática incentiva a participação ativa dos alunos, promovendo um ambiente de aprendizagem colaborativo e enriquecedor. Além disso, sua paixão pela disciplina é evidente em cada aula, inspirando seus alunos a se esforçarem para alcançar excelência acadêmica.",

        rec11_relationship:
          "Em 1 de março de 2024, Tulio respondia a João Paulo",

        rec11_recommendation:
          "Tive o prazer de ser liderado pelo Aramuni durante a maior parte do tempo em que trabalhei na Trybe, e posso afirmar que foi uma liderança exemplar e inspiração como profissional. Sempre se preocupou com o desenvolvimento de seus liderados, apontando oportunidades dentro da empresa para evolução e incentivando a realização de cursos e leitura de livros. Sempre que levava observações de pontos de melhora na operação era incentivado pelo João a reunir dados e documentar fatos para que pudesse embasar discussões com lideranças de níveis superiores a fim de melhorar processos do time com um todo, o que rendeu mudanças em algumas tarefas que eram realizadas por todos os demais instrutores e especialistas da empresa. Recomendo fortemente tanto como liderança como referência técnica de computação.",

        rec12_relationship:
          "Em 8 de fevereiro de 2024, Luíza respondia a João Paulo",

        rec12_recommendation:
          "O professor Aramuni é um educador excepcional na área de Banco de Dados. Durante o período em que fui sua aluna, pude experimentar uma abordagem de ensino verdadeiramente didática, que fez toda a diferença em minha jornada acadêmica, não apenas domina profundamente o conteúdo, mas também possui a habilidade única de transmitir conceitos complexos de uma maneira clara e acessível. Sua abordagem leve e divertida torna as aulas envolventes, proporcionando um ambiente propício para o aprendizado. Além disso, sua paciência e disposição em ajudar os alunos foram essenciais para o meu desenvolvimento acadêmico. Tenho certeza de que ele continuará impactando positivamente a vida de seus alunos, assim como fez comigo.",

        rec13_relationship:
          "Em 30 de janeiro de 2024, Thiago respondia a João Paulo",

        rec13_recommendation:
          "O Professor João Paulo Aramuni, é um excelente professor! Quando iniciei na faculdade tive muita dificuldade com Java e estava tomando raiva/trauma da matéria, porém após as aulas, eu aprendi a gostar e com a ajuda dele comecei a me aperfeiçoar e melhorar cada vez mais. Sua forma de ensino é incrível e cativante, desmistificando aquilo que parece ser complexo, tornando para algo simples! Ele consegue abordar os detalhes e nos ensina não somente a fazer, mas entender o que estamos fazendo, sempre me deu muito apoio, mesmo fora da faculdade, sempre pude e posso contar com ele! Sou muito grato!",

        rec14_relationship:
          "Em 18 de dezembro de 2023, Carlos respondia a João Paulo",

        rec14_recommendation:
          "Trabalhar sob a liderança de Aramuni por 18 meses foi uma baita de uma experiência tanto para o meu desenvolvimento profissional quanto para o pessoal. Aramuni demonstrou ser um líder excepcional, fornecendo suporte contínuo, e a liberdade criativa que todo o time precisava seja para lecionar ou para criar um conteúdo de alta qualidade. Com seus conhecimentos sobre Python, algoritmos e raspagem de dados, Aramuni foi pedra angular na construção e operação do módulo de ciência da computação. Aprendi muito com ele, não só em termos técnicos, mas também em como ser um profissional mais completo e adaptável. Sou grato por toda a sua orientação e o considero um mentor, líder e amigo.",

        rec15_relationship:
          "Em 6 de novembro de 2023, João Vitor respondia a João Paulo",

        rec15_recommendation:
          "Atuando como minha liderança, o Aramuni me fez evoluir muito. Trouxe ótimos PDIs, discussões técnicas e, também, recomendações excelentes de estudo. Além disso, foi uma liderança que gerava oportunidades tanto para os menos experientes quanto para os mais experientes, favorecendo a confiança de todos os seus diretos. Possui uma ótima gestão de pessoas, todo o time o admirava. Ressalto, também, que além dos benefícios para crescimento e entrega dos liderados, ele mantinha o foco em gerar valor para o negócio, e com isso, fez entregas excelentes. Recomendo o Aramuni como uma liderança que pode agregar tanto para a empresa tanto para seus diretos.",

        rec16_relationship:
          "Em 25 de outubro de 2023, Tiago respondia a João Paulo",

        rec16_recommendation:
          "O Aramuni realiza uma liderança muito humana, com bastante atenção aos pontos de melhoria e o que é necessário fazer para atingir as metas. Sou muito grato por ter sido liderado por ele, e dizer que cresci muito como profissional e pessoa porque ele é um excelente ouvinte e super empático. A sua recomendação é muito merecida porque é um profissional extremamente comprometido e responsável, que não tem medo de dar a cara quando é preciso.",

        rec17_relationship: "Em 8 de junho de 2023, Eli respondia a João Paulo",

        rec17_recommendation:
          "É um prazer recomendar o Aramuni, ele foi minha liderança na Trybe e também acompanhei seu trabalho como Líder Técnico de Currículo de Ciência da Computação. Durante esse período, pude testemunhar suas habilidades excepcionais e seu comprometimento com o sucesso da equipe. Sua combinação única de conhecimento acadêmico, experiência prática e habilidades de liderança o tornam um profissional notável. Além disso, ele é uma pessoa incrível, sempre disposta a ajudar e contribuir com os outros. Sua orientação e apoio foram essenciais para minha evolução profissional, tanto em termos técnicos quanto em desenvolvimento pessoal. Sou extremamente grato por tudo o que aprendi com ele e recomendo-o com muito orgulho.",

        rec18_relationship:
          "Em 9 de maio de 2023, Cristiano respondia a João Paulo",

        rec18_recommendation:
          "Aramuni é uma pessoa que demonstra extrema responsabilidade com suas atribuições profissionais e é uma pessoa que tem o dom de saber se relacionar com as pessoas tornando o ambiente de trabalho local leve e agradável. Pessoalmente aprende rápido os processos, é extremamente focado em suas atividades, demonstra potencial técnico altíssimo, está sempre preocupado com sua constante evolução, isso tudo sem abandonar o carinho e cuidado com as pessoas. Gosto muito de trabalhar com ele pois aprendo muito e me torno um profissional melhor com seus exemplos e conselhos. Sou grato por essa oportunidade diária de parceria em atividades e desejo de coração manter essa relação produtiva por muito tempo.",

        rec19_relationship:
          "Em 12 de março de 2023, Will e João Paulo estudavam na mesma instituição",

        rec19_recommendation:
          "Excelente oportunidade que tive em trabalhar com o Aramuni, aprendi muito com ele. Afinal foi minha primeira experiência lecionando Programação, e ele me ensinou e muito. Ótimo Professor e Líder, sempre pontuando o time com feedbacks assertivos! Obrigado Aramuni!",

        rec20_relationship:
          "Em 7 de fevereiro de 2022, João Paulo era sênior em relação a André, mas não supervisionava André diretamente",

        rec20_recommendation:
          "O Aramuni consegue organizar pautas e trazer objetividade às reuniões, mantendo o time organizado e orientado. Além disso, é super calmo e gente boa, e sempre traz umas músicas suaves pros momentos descontraídos. Um cara muito legal para se trabalhar com =D",

        rec21_relationship:
          "Em 10 de agosto de 2021, Douglas respondia a João Paulo",

        rec21_recommendation:
          "Ter o Aramuni como instrutor foi uma das melhores experiências que eu tive na minha vida. Seus conselhos e direcionamento me fez perceber exatamente minhas qualidades e fraquezas tecnológicas. Hoje eu sei para onde eu vou, pois sei qual caminho percorrer. Paciência, calma, lucidez e estratégia para ensinar, me dava confiança que eu ia vencer qualquer etapa que por ventura surgia. Ele é brilhante como instrutor, lead, influênciador e um amigo para a vida toda.",

        rec22_relationship:
          "Em 2 de outubro de 2020, João Paulo era sênior em relação a Bruno, mas não supervisionava Bruno diretamente",

        rec22_recommendation:
          "Tive o prazer de ser Aluno e Orientado do TCC pelo João. Uma pessoa que sempre fez a diferença, no meio acadêmico, e que me ajudou e muito a me tornar o profissional que eu sou hoje. E como eu digo, professores brilhantes ensinam para uma profissão. Professores fascinantes como o João ensinam para a vida.",

        rec23_relationship:
          "Em 11 de setembro de 2020, Klelvin trabalhava com João Paulo na mesma equipe",

        rec23_recommendation:
          "Conheço o João tem bem uns 10 anos e compartilhei com ele vários momentos da vida durante a carreira. Foi colega de faculdade, colega de trabalho e se tornou um amigo de vida. Acadêmico dedicado, educador exemplar e profissional de atribuições ímpares. Quem dera todo lugar que eu trabalhasse tivesse um João Paulo.",

        rec24_relationship:
          "Em 25 de abril de 2020, Rafael trabalhava com João Paulo na mesma equipe",

        rec24_recommendation:
          "João é um profissional exemplar e por ter background acadêmico, está sempre aberto a aprender novas tecnologias e métodos. Ao mesmo tempo sempre está compartilhando conhecimento com todo mundo.",

        rec25_relationship:
          "Em 17 de novembro de 2018, Eduardo e João Paulo estudavam na mesma instituição",

        rec25_recommendation:
          "Tive o prazer de ser aluno do João Paulo na FUMEC e seguramente é um dos professores/profissionais mais competentes com o qual convivi. Sempre busca oferecer o melhor aos seus alunos, preparando aulas e projetos diferenciados. Trata-se de um profissional com bastante experiência e conhecimento.",

        rec26_relationship:
          "Em 27 de março de 2018, Bruno era cliente de João Paulo",

        rec26_recommendation:
          "É inefável os talentos exibidos pelo prof. João, o pouco que o conheço, como seu aluno, fica evidente suas qualidades profissionais e interpessoais. Sempre disponível mostra total interesse em fazer um excelente trabalho, no caso transmitir conhecimento. Se existe alguém o qual gostaria de ter como colega de equipe seria o João Paulo.",

        rec27_relationship:
          "Em 23 de março de 2018, Leonardo era cliente de João Paulo",

        rec27_recommendation:
          "João Paulo é um professor excepcional, mostra que a programação vai muito além da sintaxe. Guia o aluno em toda a busca pelo conhecimento, sendo não apenas professor, mas também companheiro. Extremamente aberto para responder quaisquer dúvidas e nos ajudar a evoluir.",

        rec28_relationship:
          "Em 20 de março de 2018, Rafaela era cliente de João Paulo",

        rec28_recommendation:
          "Eu conheço o João Paulo como 'Professor Aramuni', onde foi a primeira vez que tive contato com ele. Posso dizer que ele é um dois melhores professores que eu tive: super dedicado, explica bem a matéria e mostra ter conhecimento total do que ele está ensinando. Eu pedi bastante a sua ajuda no decorrer do curso e sempre recebi uma resposta rápida, foi ótimo! Ele faz o possível para nos incentivar a estudar, fala de vagas de emprego e estágio para os que estão precisando, e incentiva as pessoas a aprofundar seus estudos em cursos, livros, iniciação científica e até seguir para o mestrado e doutorado. Foi um prazer ter aula com ele, e espero trabalhar com ele no futuro!",

        rec29_relationship:
          "Em 19 de março de 2018, Pedro Henrique era cliente de João Paulo",

        rec29_recommendation:
          "Excelente professor! Mestre diferenciado em que está atualizado a novas metodologias de ensino! Intriga e desafia seus alunos a pensar diferente. Sempre disponível e atencioso!",

        rec30_relationship:
          "Em 19 de março de 2018, Henrique era cliente de João Paulo",

        rec30_recommendation: "Excelente professor, com dinâmica e paciência!",

        rec31_relationship:
          "Em 19 de março de 2018, Rubens era cliente de João Paulo",

        rec31_recommendation:
          "João Paulo é o tipo de professor que se propõe a garantir que o aluno assimile a matéria, tanto em sua didática quanto em sua postura perante a classe. Demonstra um grande conhecimento na área que leciona e se dispõe a entender e atender individualmente aos alunos. Fugindo do estereótipo de professor universitário que apenas 'te indica o caminho da aprendizagem'.",

        rec32_relationship:
          "Em 19 de março de 2018, Vicente era cliente de João Paulo",

        rec32_recommendation:
          "Como professor, Joāo Paulo tornou-se fundamental na minha formaçāo, tendo em vista que tive/tenho aprendido muito a fundo a programaçāo, se destaca em nāo ensinar o básico e sim o que é cobrado na pratica e no mercado de trabalho! A preocupaçāo e cuidado com o aprendizado de cada um, é ponto forte tambḿ, de modo que nāo mede esforços para que o aluno se capacite e consiga se destacar no mercado de trabalho. Sua experiencia no mercado de trabalho, faz com que tenhamos confiança no que está sendo passado e facilita o aprendizado quando explicita problemas reais que enfrentou em toda sua trajetória. Sou grato de ter um professor deste nivel em minha formaçāo academica.",

        rec33_relationship:
          "Em 19 de março de 2018, Igor era cliente de João Paulo",

        rec33_recommendation:
          "João Paulo é ótimo professor. Dedicado, sempre nos atende da melhor maneira. Tem uma metodologia de ensino atual que é compatível com as exigências do mercado de trabalho.",

        rec34_relationship:
          "Em 15 de fevereiro de 2018, Felipe Ferreira respondia a João Paulo",

        rec34_recommendation:
          "João Paulo é um professor totalmente motivado e interessado em ensinar. Possui um cuidado ímpar na preparação do material de ensino, sempre claro e atualizado. Sua aula é participativa, carismática e dinâmica. Fora das aulas é interessado e motivador, compartilhando vivência de mercado e bons conselhos. Um dos melhores professores que já tive e grande amigo.",

        rec35_relationship:
          "Em 28 de dezembro de 2017, Gabriel respondia a João Paulo",

        rec35_recommendation:
          "O João é um excelente professor, conseguiu deixar todas as aulas interessantes. Também consegue passar a informação de forma simples, está sempre desafiando seus alunos para aprender mais.",

        rec36_relationship:
          "Em 19 de dezembro de 2017, Thiago Brito e João Paulo estudavam na mesma instituição",

        rec36_recommendation:
          "Excelente professor, sempre preocupado com o aprendizado, além de proporcionar bons materiais e dicas de estudo. Também excelente como pessoa, procurando guardar nomes e ficar próximo dos alunos. Agradeço a oportunidade de tê-lo como meu professor.",

        rec37_relationship:
          "Em 17 de dezembro de 2017, Gabriel e João Paulo estudavam na mesma instituição",

        rec37_recommendation:
          "Está na lista dos melhores professores que já tive na vida. Ao mesmo tempo que te cobra bastante, faz você ter interesse no que está cobrando, tira qualquer dúvida, e é alguém que você quer levar como amigo pro resto da vida. Simplesmente sensacional. Valeu demais pelos conhecimentos que já passou e está me passando.",

        rec38_relationship:
          "Em 15 de dezembro de 2017, Amanda era cliente de João Paulo",

        rec38_recommendation:
          "Ótimo professor, atencioso, possui muito conhecimento e didática boa.",

        rec39_relationship:
          "Em 14 de dezembro de 2017, Nilson Junio Paulino era cliente de João Paulo",

        rec39_recommendation:
          "Ótimo professor, se empenha em cada matéria que leciona, sempre busca conhecimento além dos livros e tem uma didática excelente. Espero ser aluno dele em outra matéria, pois sei que será bem lecionada.",

        rec40_relationship:
          "Em 13 de dezembro de 2017, Lucas era cliente de João Paulo",

        rec40_recommendation:
          "Apesar das dificuldades durante o semestre e dos inúmeros bugs corrigidos, foi possível entregar um projeto que aplicava toda a teoria e conceito que foi ensinado de forma primorosa. Posso dizer com propriedade que o professor João Paulo fará parte da minha formação, sendo peça fundamental na minha trajetória do conhecimento.",

        rec41_relationship:
          "Em 13 de dezembro de 2017, Luiz Guilherme era cliente de João Paulo",

        rec41_recommendation:
          "Tive a sorte de participar de duas matérias lecionadas pelo professor João Paulo Aramuni, Fundamentos Teóricos da Computação e Compiladores. Em ambas mostrou completo interesse para tirar dúvidas, ajudar alunos com dificuldades, e sempre teve paciência e compreensão. Suas aulas possuem dinâmicas que facilitam o entendimento e aprendizagem, com total domínio das matérias e exemplos práticos.",

        rec42_relationship:
          "Em 13 de dezembro de 2017, João Paulo era cliente de David",

        rec42_recommendation:
          "Excelente professor, ótima didática e uma grande vontade de ensinar. As aulas foram muito bem ministradas!",

        rec43_relationship:
          "Em 11 de dezembro de 2017, João Paulo era sênior em relação a Samuel, mas não supervisionava Samuel diretamente",

        rec43_recommendation:
          "O Professor Aramuni é um dos melhores professores que já tive. Seu estilo de lecionar consegue explicar até a maior e mais complexa abstração de forma clara, possibilitando que todos absorvam o conhecimento e solucionem problemas complexos. Não há melhor pessoa para orientação do que o João Paulo.",

        rec44_relationship:
          "Em 19 de junho de 2017, João Lucas Veloso era cliente de João Paulo",

        rec44_recommendation:
          "João é um professor que busca e desenvolve métodos para que seus alunos aprendam. Sempre se mostrou comprometido a ajudar, oferecendo material bem preparado e paciência para respeitar o ritmo de cada aluno.",

        rec45_relationship:
          "Em 9 de fevereiro de 2017, Fábio e João Paulo estudavam na mesma instituição",

        rec45_recommendation:
          "Grande professor, atencioso, conhece muito bem o que ensina. Suas aulas foram de grande valia e sua didática foi além das expectativas. Feliz de ter compartilhado aprendizados com ele.",

        rec46_relationship:
          "Em 9 de janeiro de 2017, Márcio trabalhava com João Paulo na mesma equipe",

        rec46_recommendation:
          "Trabalho com o João Paulo a cerca de um ano e afirmo ser um profissional muito dedicado, responsável e estudioso. Sempre busca conhecimento e compartilha soluções com a equipe, favorecendo o crescimento de todos.",

        rec47_relationship:
          "Em 17 de outubro de 2016, Felipe e João Paulo estudavam na mesma instituição",

        rec47_recommendation:
          "Tive o grande prazer de ter sido aluno do João Paulo na Universidade FUMEC. Professor TOP, competente, atencioso, descontraído, que consegue explicar matérias complexas de forma clara e simples. Tudo isso graças ao seu amor pelo que faz. Sucesso João!",

        rec48_relationship:
          "Em 10 de outubro de 2016, Bruno era cliente de João Paulo",

        rec48_recommendation:
          "Tive o prazer de ser aluno do João Aramuni na universidade FUMEC. Profissional sério e dedicado, consegue passar o conhecimento da linguagem de programação de forma estruturada e clara. Excelente professor e desejo que se destaque bastante em sua carreira acadêmica.",

        rec49_relationship:
          "Em 23 de agosto de 2015, Rafael e João Paulo estudavam na mesma instituição",

        rec49_recommendation:
          "Tive a oportunidade de estudar com o João Paulo na FUMEC. Profissional diferenciado, organizado, persistente, autodidata e apaixonado por metodologias ágeis. Se destacava pela comunicação e pelo compartilhamento de conhecimento.",

        rec50_relationship:
          "Em 4 de março de 2015, Gabriela e João Paulo estudavam na mesma instituição",

        rec50_recommendation:
          "Recomendo João pela sua competência, por gostar da área em que atua e ser determinado, com força de vontade e fácil convivência. Ótimo profissional.",

        rec51_relationship:
          "Em 10 de novembro de 2014, João Paulo era sênior em relação a Glaydson, mas não supervisionava Glaydson diretamente",

        rec51_recommendation:
          "Trabalho com o João Paulo há quase 1 ano e neste período ele se mostrou um profissional competente e dedicado, atuando de forma excepcional em projetos de clientes como a OI e a ANP.",

        rec52_relationship:
          "Em 9 de novembro de 2014, Lucas e João Paulo estudavam na mesma instituição",

        rec52_recommendation:
          "João é um aluno dedicado e proativo. Destacou-se em sala de aula com excelentes trabalhos e apresentações. Como palestrante aborda metodologias ágeis que cativam cada vez mais alunos.",

        rec53_relationship:
          "Em 29 de outubro de 2014, Andre trabalhava com João Paulo mas em equipes diferentes",

        rec53_recommendation:
          "Tive a oportunidade de trabalhar com João Paulo na Capgemini durante 1 ano. Profissional que visa o compartilhamento de informação e está sempre à disposição para ajudar.",

        rec54_relationship:
          "Em 14 de outubro de 2014, Amadeu e João Paulo estudavam na mesma instituição",

        rec54_recommendation:
          "João Paulo é uma pessoa envolvida nas atividades de sala de aula e pesquisa. Trabalhamos juntos em artigos e apresentações, sempre trazendo ideias inovadoras. Tem experiência com metodologias ágeis, aplicadas inclusive na dissertação de mestrado.",
      },
      experiencias: {
        titulo: "Experiências Profissionais",

        // Companies
        puc_minas: "PUC Minas",
        centro_newton_paiva: "Centro Universitário Newton Paiva",
        in8: "IN8",
        trybe: "Trybe",
        xp_educacao: "XP Educação",
        universidade_fumec: "Universidade FUMEC",
        prosegur: "Prosegur",
        capgemini: "Capgemini",
        banco_brasil: "Banco do Brasil",
        alamo_ti: "Álamo - Soluções em TI",
        cpd_face_fumec: "CPD FACE/FUMEC",
        pibic_cnpq: "PIBIC/CNPq",

        // Roles
        professor_puc: "Professor",
        professor_newton: "Professor",
        tech_manager_in8: "Tech Manager",
        dev_backend_in8: "Desenvolvedor Back-End Sênior",
        curriculum_tech_lead_trybe: "Curriculum Tech Lead",
        curriculum_lead_tech_trybe: "Curriculum Lead & Tech",
        cs_lead_instructor_trybe: "Computer Science Lead Instructor",
        backend_cs_lead_instructor_trybe: "Back-End & CS Lead Instructor",
        cs_specialist_instructor_trybe:
          "Computer Science Specialist Instructor",
        professor_xp: "Professor",
        professor_fumec: "Professor",
        analista_sistemas_pl_prosegur: "Analista de Sistemas Pleno",
        analista_sistemas_pl_capgemini: "Analista de Sistemas Pleno",
        analista_sistemas_jr_capgemini: "Analista de Sistemas Júnior",
        programador_sr_capgemini: "Programador Sênior",
        programador_jr_capgemini: "Programador Júnior",
        tecnico_programador_bb: "Técnico/Programador",
        desenvolvedor_csharp_alamo: "Desenvolvedor C#",
        estagiario_fumec: "Estagiário",
        bolsista_pibic: "Bolsista de Iniciação Científica",

        // Descriptions & Skills
        professor_puc_desc:
          "No curso de Engenharia de Software, é professor das disciplinas de Fundamentos de Projeto e Análise de Algoritmos, Projeto de Software, Laboratório de Desenvolvimento de Software, Laboratório de Experimentação de Software e Trabalho Interdisciplinar: Aplicações para Cenários Reais. Também foi professor das disciplinas de Trabalho Interdisciplinar: Aplicações Web e Algoritmos e Estruturas de Dados I (Linguagem C) do curso de Engenharia de Software e da disciplina de Laboratório de Iniciação à Programação do curso de Ciência da Computação. Orientador na disciplina de TCCII e CTO da Agência Experimental de Software do ICEI, responsável por 6 times (~30 pessoas). Condução de oficinas e aulões sobre tópicos de desenvolvimento de software, abordando Python, Spring Boot, Docker, PostgreSQL, MongoDB, Nuvem, Inteligência Artificial e mais, além da criação de conteúdo técnico e material de apoio.",
        professor_puc_skills:
          "Docência, Liderança, Desenvolvimento de software, Documentação ágil, Deploy de sistemas globais, Manutenção de sistemas legados, Padrões de projeto, Metodologias ágeis.",

        professor_newton_desc:
          "Professor das disciplinas de Linguagens de Programação (Java), Arquitetura de Aplicações Web e Banco de Dados dos cursos de Ciência da Computação, Sistemas de Informação e Análise e Desenvolvimento de Sistemas. Professor destaque do curso de Sistemas de Informação (2º semestre de 2023). Lógica de Programação com jogos (Scratch) para o ensino médio do Colégio Santa Dorotéia e Colégio ICJ.",
        professor_newton_skills:
          "Docência, Java, Arquitetura de aplicações Web, Banco de Dados, Lógica de programação lúdica.",

        tech_manager_in8_desc:
          "Liderança de squads responsáveis por múltiplos projetos de desenvolvimento de sistemas para o mercado de milhas aéreas. Facilitador para assegurar execução contínua, alinhamento de demandas e solução de impedimentos. Responsável pela disponibilidade, escalabilidade, performance e segurança das aplicações, integração técnica com produto, dados e negócios, contato direto com clientes, condução de contratações e mentoria de equipes. Tech Stack: Node.js, Next.js, Python, FastAPI, AWS, Docker, Redis, Amazon SQS, GitLab, Grafana, New Relic.",
        tech_manager_in8_skills:
          "Gestão de projetos de tecnologia, Comunicação eficaz, Resolução de problemas, Liderança técnica, Node.js, Next.js, Python, FastAPI, AWS, Docker, CI/CD, Monitoramento de sistemas.",

        curriculum_tech_lead_trybe_desc:
          "Responsável pela estrutura curricular em Python e pelo desenvolvimento técnico do time. Tomada de decisão baseada em dados para maximizar empregabilidade dos estudantes. Formação, orientação técnica e mentoria da equipe, produção de conteúdos complexos e desenvolvimento de instrumentos de avaliação.",
        curriculum_tech_lead_trybe_skills:
          "Liderança técnica, Ciência da computação, Python, Gestão de equipe, Produção de conteúdo, Avaliação educacional.",

        curriculum_lead_tech_trybe_desc:
          "Gestão da estrutura curricular em Python e liderança de time de 3 pessoas. Definição de OKRs e KPIs da área, produção de conteúdo técnico em Python e Java e orientação direta da equipe.",
        curriculum_lead_tech_trybe_skills:
          "Gestão de conteúdo, Python, Java, Liderança de equipe, Definição de OKRs e KPIs.",

        cs_lead_instructor_trybe_desc:
          "Gestão da operação de aprendizagem de turmas e de um time de 10 pessoas. Definição de OKRs e KPIs da área, processos seletivos e liderança direta de instrutores e especialistas de Ciência da Computação.",
        cs_lead_instructor_trybe_skills:
          "Liderança de equipe, Ciência da computação, Liderança técnica, Definição de OKRs e KPIs.",

        backend_cs_lead_instructor_trybe_desc:
          "Gestão da operação de aprendizagem de turmas e de um time de 17 pessoas. Definição de OKRs e KPIs da área, processos seletivos e liderança direta de instrutores de Back-End e Ciência da Computação.",
        backend_cs_lead_instructor_trybe_skills:
          "Liderança de equipe, Back-End, Ciência da computação, Liderança técnica, Definição de OKRs e KPIs.",

        cs_specialist_instructor_trybe_desc:
          "Ministrou aulas de Python, POO, Web Scraping, algoritmos e estruturas de dados. Participou da construção da primeira versão do currículo de Ciência da Computação da Trybe. Instrutor da primeira turma da Trybe (Turma 1).",
        cs_specialist_instructor_trybe_skills:
          "Docência, Ciência da computação, Python, JavaScript, POO, Web Scraping, Algoritmos e Estruturas de Dados.",

        professor_xp_desc:
          "Professor de Arquitetura de Software e Engenharia de Requisitos. Apresentação de conceitos fundamentais, práticas e ferramentas utilizadas em projetos arquiteturais, com desenvolvimento de hard e soft skills para arquitetos de software.",
        professor_xp_skills:
          "Docência, Arquitetura de Software, Engenharia de Requisitos, Java, C++, VBScript, Shell Script.",

        professor_fumec_desc:
          "Professor das disciplinas de Fundamentos Teóricos da Computação, Compiladores e POO. Professor das disciplinas de Desenvolvimento de Scripts I e II em Redes de Computadores. Professor das disciplinas de Engenharia de Software II e Introdução à Programação Web em Sistemas de Informação EaD. Orientação de monografias, coordenação de projetos de extensão e direcionamento de alunos para estágio e mercado.",
        professor_fumec_skills:
          "Docência, Fundamentos Teóricos da Computação, Compiladores, POO, Engenharia de Software, Programação Web, Desenvolvimento de Scripts.",

        dev_backend_in8_desc:
          "Web scraping e desenvolvimento de crawlers em Python 3 para programas de milhas aéreas. Criação e manutenção de APIs RESTful para extração de dados e automação de navegadores. Arquitetura cloud AWS com HA/DR, CI/CD, administração de containers Docker e monitoramento com Grafana e New Relic.",
        dev_backend_in8_skills:
          "Python, Web Scraping, APIs RESTful, AWS, Docker, CI/CD, Observabilidade e monitoramento.",

        analista_sistemas_pl_prosegur_desc:
          "Desenvolvimento de sistema distribuído em Java 8, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink. Implantação em âmbito global. Software Maintenance, refatoração e melhorias de performance. Testes de WebServices e automatizados. Manipulação de Banco de Dados Oracle. Programação PL/SQL. Documentação de Casos de Uso. Metodologia Ágil Scrum.",

        analista_sistemas_pl_prosegur_skills:
          "Java, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink, PL/SQL, Oracle, Scrum, Testes automatizados.",

        analista_sistemas_pl_capgemini_desc:
          "Análise e desenvolvimento em Java / Java Web; Manutenção de sistemas em VB6 / VB.NET. Desenvolvimento Web ASP Clássico / ASP.NET. Manipulação de Banco de Dados SQLServer / Oracle. Programação com PL/SQL. Documentação e UML. Metodologia Ágil Lean Manufacturing.",
        analista_sistemas_pl_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        analista_sistemas_jr_capgemini_desc:
          "Análise e desenvolvimento em Java / Java Web; Manutenção de sistemas em VB6 / VB.NET. Desenvolvimento Web ASP Clássico / ASP.NET. Manipulação de Banco de Dados SQLServer / Oracle. Programação com PL/SQL. Documentação e UML. Metodologia Ágil Lean Manufacturing.",
        analista_sistemas_jr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_sr_capgemini_desc:
          "Segunda vez na história da Capgemini no Brasil em que houve uma progressão de Junior para Sênior pulando-se a posição de Pleno.",
        programador_sr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_jr_capgemini_desc:
          "Desenvolvimento e manutenção dos sistemas SIGEP e SIMP da ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis), com foco em aplicações web, processamento de documentos e suporte à conformidade regulatória.",
        programador_jr_capgemini_skills:
          "ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        tecnico_programador_bb_desc:
          "Estágio supervisionado em desenvolvimento e suporte a aplicativos em Java / Java Web; Manutenção de sistemas integrados ao SISBB. Desenvolvimento e suporte a aplicações legadas VBA / VB6; Programação PL/SQL; Levantamento de requisitos.",
        tecnico_programador_bb_skills:
          "Java, Java Web, VBA, VB6, PL/SQL, Automação Bancária.",

        desenvolvedor_csharp_alamo_desc:
          "Desenvolvimento em C# /.NET v3.5 para sistema de gestão de projetos e controle de ponto eletrônico. Desenvolvimento Web com ASP.NET. Controle de versão com TortoiseCVS. Manipulação de Banco de Dados SQL Server. Criação de procedures e triggers.",
        desenvolvedor_csharp_alamo_skills:
          "C#, ASP.NET, SQL Server, Procedures, Triggers.",

        estagiario_fumec_desc:
          "Estágio em CPD FACE/FUMEC: Desenvolvimento de aplicativos internos com PHP e Jquery. Suporte técnico em redes. Manutenção de servidores Linux. Programação com Shell Script. Help Desk.",
        estagiario_fumec_skills:
          "PHP, Jquery, Shell Script, Redes, Linux, Help Desk.",

        bolsista_pibic_desc:
          "Bolsista PIBIC/CNPq em projeto sobre microscopia de força atômica para investigar interação de compostos polifenólicos com células e vírus HTLV-1. Desenvolvido na UFMG e CETEC, orientado pelo Prof Dr Orlando Abreu Gomes.",
        bolsista_pibic_skills:
          "Pesquisa científica, Microscopia de Força Atômica, Biologia celular, Virologia, Documentação científica, Apoio à pesquisa acadêmica",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
