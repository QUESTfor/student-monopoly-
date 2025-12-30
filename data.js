// Game Data - Acts as Database

const GAME_DATA = {
    spaces: [
        {pos: 0, name: '開始 Start', type: 'start', nameEn: 'Start'},
        {pos: 1, name: '教室 A', type: 'academic', nameEn: 'Classroom A'},
        {pos: 2, name: '餐廳', type: 'life', nameEn: 'Cafeteria'},
        {pos: 3, name: '銀行', type: 'financial', nameEn: 'Bank'},
        {pos: 4, name: '社團活動', type: 'life', nameEn: 'Club Activities'},
        {pos: 5, name: '打工中心', type: 'financial', nameEn: 'Part-Time Job'},
        {pos: 6, name: '圖書館', type: 'academic', nameEn: 'Library'},
        {pos: 7, name: '運動中心', type: 'life', nameEn: 'Sports Center'},
        {pos: 8, name: '職涯中心', type: 'career', nameEn: 'Career Center'},
        {pos: 9, name: '宿舍', type: 'life', nameEn: 'Dormitory'},
        {pos: 10, name: '獎學金辦公室', type: 'financial', nameEn: 'Scholarship'},
        {pos: 11, name: '教室 B', type: 'academic', nameEn: 'Classroom B'},
        {pos: 12, name: '學生會', type: 'life', nameEn: 'Student Union'},
        {pos: 13, name: '書店', type: 'financial', nameEn: 'Bookstore'},
        {pos: 14, name: '實習博覽會', type: 'career', nameEn: 'Internship Fair'},
        {pos: 15, name: '咖啡店', type: 'financial', nameEn: 'Coffee Shop'},
        {pos: 16, name: '讀書會', type: 'academic', nameEn: 'Study Group'},
        {pos: 17, name: '健康中心', type: 'life', nameEn: 'Health Center'},
        {pos: 18, name: '交流活動', type: 'career', nameEn: 'Networking'},
        {pos: 19, name: '考試大廳', type: 'academic', nameEn: 'Exam Hall'},
        {pos: 20, name: '助學金', type: 'financial', nameEn: 'Financial Aid'},
        {pos: 21, name: '校園活動', type: 'life', nameEn: 'Campus Event'},
        {pos: 22, name: '技能工作坊', type: 'career', nameEn: 'Skills Workshop'},
        {pos: 23, name: '教授辦公室', type: 'academic', nameEn: 'Professor Office'},
        {pos: 24, name: '面試練習', type: 'career', nameEn: 'Interview Practice'},
        {pos: 25, name: '志工服務', type: 'life', nameEn: 'Volunteer'},
        {pos: 26, name: '投資社', type: 'financial', nameEn: 'Investment Club'},
        {pos: 27, name: '論文答辯', type: 'academic', nameEn: 'Thesis Defense'},
        {pos: 28, name: '企業參訪', type: 'career', nameEn: 'Company Visit'},
        {pos: 29, name: '文化節', type: 'life', nameEn: 'Cultural Festival'},
        {pos: 30, name: '預算規劃', type: 'financial', nameEn: 'Budget Planning'},
        {pos: 31, name: '履歷製作', type: 'career', nameEn: 'Resume Building'},
        {pos: 32, name: '學術獎項', type: 'academic', nameEn: 'Academic Award'},
        {pos: 33, name: '助學貸款', type: 'financial', nameEn: 'Student Loan'},
        {pos: 34, name: 'LinkedIn工作坊', type: 'career', nameEn: 'LinkedIn Lab'},
        {pos: 35, name: '工作錄取', type: 'career', nameEn: 'Job Offer'}
    ],

    randomEvents: [
        {
            id: 1,
            name: '打工機會',
            nameEn: 'Part-Time Job Offer',
            description: '一家咖啡店正在招募工讀生！你要接受這份工作嗎？',
            descriptionEn: 'A cafe is hiring! Do you want to take the part-time job?',
            type: 'choice',
            optionA: {
                text: '接受工作',
                textEn: 'Accept Job',
                successRate: 50,
                successResult: {
                    message: '遇到好老闆！獲得額外獎勵',
                    messageEn: 'Great boss! Extra rewards earned',
                    credits: 1500,
                    careerPoints: 100
                },
                failResult: {
                    message: '遇到壞老闆！沒有薪水還被剝削',
                    messageEn: 'Bad boss! No pay and exploited',
                    credits: 0,
                    careerPoints: -200
                }
            },
            optionB: {
                text: '拒絕工作',
                textEn: 'Decline',
                result: {
                    message: '你專注於學業',
                    messageEn: 'You focused on studies',
                    academicPoints: 50
                }
            },
            triggerSpaces: [5, 15, 25]
        },
        {
            id: 2,
            name: '讀書會邀請',
            nameEn: 'Study Group Invitation',
            description: '朋友邀請你加入讀書會，要參加嗎？',
            descriptionEn: 'Friends invite you to join their study group',
            type: 'choice',
            optionA: {
                text: '加入讀書會',
                textEn: 'Join Group',
                successRate: 60,
                successResult: {
                    message: '非常有效率的討論！',
                    messageEn: 'Productive session!',
                    academicPoints: 200
                },
                failResult: {
                    message: '聊天太多，浪費時間',
                    messageEn: 'Too much chatting',
                    energy: -1
                }
            },
            optionB: {
                text: '自己讀書',
                textEn: 'Study Alone',
                result: {
                    message: '安靜專注學習',
                    messageEn: 'Quiet focus',
                    academicPoints: 100
                }
            },
            triggerSpaces: [7, 17, 27]
        },
        {
            id: 3,
            name: '獎學金機會',
            nameEn: 'Scholarship Opportunity',
            description: '你發現一個獎學金申請機會！',
            descriptionEn: 'You found a scholarship application!',
            type: 'challenge',
            optionA: {
                text: '立即申請',
                textEn: 'Apply Now',
                successRate: 40,
                successResult: {
                    message: '獲得獎學金！',
                    messageEn: 'Scholarship awarded!',
                    credits: 3000
                },
                failResult: {
                    message: '未獲選，下次再接再厲',
                    messageEn: 'Not selected, try again later',
                    credits: 0
                }
            },
            optionB: {
                text: '放棄',
                textEn: 'Skip',
                result: {
                    message: '沒有變化',
                    messageEn: 'No change',
                    credits: 0
                }
            },
            triggerSpaces: [10, 20, 30]
        },
        {
            id: 4,
            name: '社團幹部邀請',
            nameEn: 'Club Leadership Offer',
            description: '你被邀請擔任學生社團幹部！',
            descriptionEn: 'You are invited to lead a student club',
            type: 'choice',
            optionA: {
                text: '接受職位',
                textEn: 'Accept Role',
                successRate: 55,
                successResult: {
                    message: '領導能力大幅提升！',
                    messageEn: 'Leadership skills improved!',
                    socialPoints: 300,
                    careerPoints: 200
                },
                failResult: {
                    message: '工作太多，身心俱疲',
                    messageEn: 'Overwhelming workload',
                    energy: -2
                }
            },
            optionB: {
                text: '婉拒',
                textEn: 'Decline',
                result: {
                    message: '有更多自由時間',
                    messageEn: 'More free time',
                    energy: 1
                }
            },
            triggerSpaces: [12, 22, 32]
        },
        {
            id: 5,
            name: '實習招聘會',
            nameEn: 'Internship Fair',
            description: '校園正在舉辦實習招聘會！',
            descriptionEn: 'Companies are recruiting on campus!',
            type: 'luck',
            optionA: {
                text: '參加招聘會',
                textEn: 'Attend Fair',
                successRate: 45,
                successResult: {
                    message: '獲得面試機會！',
                    messageEn: 'Got interview!',
                    careerPoints: 500
                },
                failResult: {
                    message: '沒有回音，但有所收穫',
                    messageEn: 'No callbacks, but learned',
                    careerPoints: 50
                }
            },
            optionB: {
                text: '跳過活動',
                textEn: 'Skip Event',
                result: {
                    message: '錯過機會',
                    messageEn: 'Missed opportunity',
                    credits: 0
                }
            },
            triggerSpaces: [14, 24, 34]
        },
        {
            id: 6,
            name: '突擊考試',
            nameEn: 'Surprise Quiz',
            description: '教授突然宣布小考！',
            descriptionEn: 'Professor announces surprise quiz!',
            type: 'challenge',
            optionA: {
                text: '認真作答',
                textEn: 'Take Quiz',
                successRate: 50,
                successResult: {
                    message: '考得不錯！',
                    messageEn: 'Did well!',
                    academicPoints: 150
                },
                failResult: {
                    message: '準備不足',
                    messageEn: 'Underprepared',
                    academicPoints: -50
                }
            },
            optionB: {
                text: '請假',
                textEn: 'Skip Class',
                result: {
                    message: '錯過考試',
                    messageEn: 'Missed quiz',
                    academicPoints: -100
                }
            },
            triggerSpaces: [1, 11, 23]
        },
        {
            id: 7,
            name: '投資機會',
            nameEn: 'Investment Opportunity',
            description: '朋友推薦一個投資機會',
            descriptionEn: 'Friend recommends an investment',
            type: 'choice',
            optionA: {
                text: '投資 1000元',
                textEn: 'Invest $1000',
                successRate: 40,
                successResult: {
                    message: '投資成功！獲利豐厚',
                    messageEn: 'Investment success!',
                    credits: 2000
                },
                failResult: {
                    message: '投資失敗，血本無歸',
                    messageEn: 'Investment failed',
                    credits: -1000
                }
            },
            optionB: {
                text: '保守理財',
                textEn: 'Save Money',
                result: {
                    message: '穩定儲蓄',
                    messageEn: 'Steady savings',
                    credits: 100
                }
            },
            triggerSpaces: [3, 13, 26]
        },
        {
            id: 8,
            name: '健康危機',
            nameEn: 'Health Issue',
            description: '你感覺身體不適',
            descriptionEn: 'You feel unwell',
            type: 'choice',
            optionA: {
                text: '去看醫生',
                textEn: 'See Doctor',
                successRate: 70,
                successResult: {
                    message: '及時治療，完全康復',
                    messageEn: 'Timely treatment, fully recovered',
                    credits: -300,
                    energy: 2
                },
                failResult: {
                    message: '花錢但症狀未改善',
                    messageEn: 'Spent money but still sick',
                    credits: -300,
                    energy: -1
                }
            },
            optionB: {
                text: '休息一下',
                textEn: 'Rest',
                result: {
                    message: '自然康復',
                    messageEn: 'Natural recovery',
                    energy: 1
                }
            },
            triggerSpaces: [17]
        }
    ],

    questions: [
        {
            id: 1,
            category: 'academic',
            text: '哪種學習方法最有效於長期記憶？',
            textEn: 'Which study method is most effective for long-term retention?',
            options: [
                {label: 'A', text: '考前臨時抱佛腳', textEn: 'Cramming before exam'},
                {label: 'B', text: '間隔重複學習', textEn: 'Spaced repetition'},
                {label: 'C', text: '只讀一次', textEn: 'Reading once'},
                {label: 'D', text: '全部畫重點', textEn: 'Highlighting everything'}
            ],
            correctAnswer: 'B',
            explanation: '間隔重複學習讓大腦有時間鞏固記憶',
            explanationEn: 'Spaced repetition allows brain to consolidate memories',
            points: 150
        },
        {
            id: 2,
            category: 'financial',
            text: '你有2000元存款，3個月後要繳學費，最好的選擇是？',
            textEn: 'You have $2000 saved, tuition due in 3 months. Best option?',
            options: [
                {label: 'A', text: '投資高風險股票', textEn: 'Invest in risky stocks'},
                {label: 'B', text: '存在儲蓄帳戶', textEn: 'Keep in savings account'},
                {label: 'C', text: '買新電腦', textEn: 'Buy new laptop'},
                {label: 'D', text: '借給朋友', textEn: 'Lend to friend'}
            ],
            correctAnswer: 'B',
            explanation: '短期需要的錢應該保持安全和流動性',
            explanationEn: 'Money needed soon should stay safe and accessible',
            points: 100
        },
        {
            id: 3,
            category: 'career',
            text: '在社交活動中，最好的交流方式是？',
            textEn: 'At a networking event, best approach?',
            options: [
                {label: 'A', text: '到處發履歷', textEn: 'Hand out resumes everywhere'},
                {label: 'B', text: '積極傾聽並提問', textEn: 'Listen actively and ask questions'},
                {label: 'C', text: '只談論自己', textEn: 'Only talk about yourself'},
                {label: 'D', text: '保持安靜', textEn: 'Stay quiet'}
            ],
            correctAnswer: 'B',
            explanation: '積極傾聽和有意義的提問能建立真正的連結',
            explanationEn: 'Active listening and thoughtful questions build genuine connections',
            points: 150
        },
        {
            id: 4,
            category: 'cultural',
            text: '泰北華校的教育理念強調什麼？',
            textEn: 'What does 泰北華校 educational philosophy emphasize?',
            options: [
                {label: 'A', text: '競爭至上', textEn: 'Competition above all'},
                {label: 'B', text: '中華文化傳承與多元發展', textEn: 'Chinese cultural heritage & diverse development'},
                {label: 'C', text: '只注重考試成績', textEn: 'Only exam scores matter'},
                {label: 'D', text: '完全西方化教育', textEn: 'Completely westernized education'}
            ],
            correctAnswer: 'B',
            explanation: '泰北華校重視文化傳承的同時促進學生全面發展',
            explanationEn: '泰北華校 values cultural heritage while promoting holistic development',
            points: 200
        },
        {
            id: 5,
            category: 'academic',
            text: '寫論文時，最重要的第一步是？',
            textEn: 'When writing a thesis, the most important first step?',
            options: [
                {label: 'A', text: '直接開始寫', textEn: 'Start writing immediately'},
                {label: 'B', text: '研究和規劃大綱', textEn: 'Research and plan outline'},
                {label: 'C', text: '抄襲他人作品', textEn: 'Copy others work'},
                {label: 'D', text: '等到最後一刻', textEn: 'Wait until last minute'}
            ],
            correctAnswer: 'B',
            explanation: '充分的研究和清晰的大綱是成功論文的基礎',
            explanationEn: 'Thorough research and clear outline are foundation of successful thesis',
            points: 120
        },
        {
            id: 6,
            category: 'financial',
            text: '收到第一份薪水後，最明智的做法是？',
            textEn: 'After receiving first paycheck, wisest action?',
            options: [
                {label: 'A', text: '全部花掉慶祝', textEn: 'Spend it all celebrating'},
                {label: 'B', text: '儲蓄30%，剩下做預算', textEn: 'Save 30%, budget the rest'},
                {label: 'C', text: '全部存起來', textEn: 'Save everything'},
                {label: 'D', text: '買彩票', textEn: 'Buy lottery tickets'}
            ],
            correctAnswer: 'B',
            explanation: '平衡儲蓄和合理消費是良好的理財習慣',
            explanationEn: 'Balancing savings and reasonable spending is good financial habit',
            points: 110
        },
        {
            id: 7,
            category: 'career',
            text: '面試時被問到弱點，應該如何回答？',
            textEn: 'When asked about weaknesses in interview, how to answer?',
            options: [
                {label: 'A', text: '說自己沒有弱點', textEn: 'Say you have no weaknesses'},
                {label: 'B', text: '提出真實弱點並說明改進計劃', textEn: 'Mention real weakness with improvement plan'},
                {label: 'C', text: '說工作太認真', textEn: 'Say you work too hard'},
                {label: 'D', text: '拒絕回答', textEn: 'Refuse to answer'}
            ],
            correctAnswer: 'B',
            explanation: '誠實面對弱點並展示成長思維會給人留下好印象',
            explanationEn: 'Honestly facing weaknesses and showing growth mindset impresses',
            points: 140
        },
        {
            id: 8,
            category: 'academic',
            text: '小組作業中，最好的貢獻方式是？',
            textEn: 'In group projects, best way to contribute?',
            options: [
                {label: 'A', text: '什麼都不做，讓別人完成', textEn: 'Do nothing, let others finish'},
                {label: 'B', text: '積極溝通，分工合作', textEn: 'Communicate actively, collaborate'},
                {label: 'C', text: '獨自完成全部工作', textEn: 'Do everything yourself'},
                {label: 'D', text: '只在最後出現', textEn: 'Only show up at the end'}
            ],
            correctAnswer: 'B',
            explanation: '有效的溝通和分工能發揮團隊最大效能',
            explanationEn: 'Effective communication and division of labor maximizes team efficiency',
            points: 130
        },
        {
            id: 9,
            category: 'financial',
            text: '學生貸款和信用卡債務，應該優先償還哪個？',
            textEn: 'Between student loans and credit card debt, which to pay first?',
            options: [
                {label: 'A', text: '學生貸款', textEn: 'Student loans'},
                {label: 'B', text: '信用卡債務', textEn: 'Credit card debt'},
                {label: 'C', text: '都不還', textEn: 'Pay neither'},
                {label: 'D', text: '隨便選一個', textEn: 'Choose randomly'}
            ],
            correctAnswer: 'B',
            explanation: '信用卡利率通常較高，應優先償還以減少利息支出',
            explanationEn: 'Credit card interest rates are usually higher, pay first to reduce interest',
            points: 120
        },
        {
            id: 10,
            category: 'career',
            text: '建立LinkedIn個人檔案時，最重要的是？',
            textEn: 'When building LinkedIn profile, most important aspect?',
            options: [
                {label: 'A', text: '上傳帥照', textEn: 'Upload attractive photo'},
                {label: 'B', text: '清晰展示技能和成就', textEn: 'Clearly showcase skills and achievements'},
                {label: 'C', text: '加很多陌生人', textEn: 'Add many strangers'},
                {label: 'D', text: '複製別人的資料', textEn: 'Copy others profiles'}
            ],
            correctAnswer: 'B',
            explanation: '專業的內容和清晰的成就展示能吸引雇主注意',
            explanationEn: 'Professional content and clear achievements attract employer attention',
            points: 110
        }
    ]
};