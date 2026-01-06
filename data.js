// Game Data - Acts as Database

const GAME_DATA = {
    spaces: [
        {pos: 0, name: '開始', type: 'start'},
        {pos: 1, name: '教室 A', type: 'academic'},
        {pos: 2, name: '餐廳', type: 'life'},
        {pos: 3, name: '銀行', type: 'financial'},
        {pos: 4, name: '社團', type: 'life'},
        {pos: 5, name: '打工', type: 'financial'},
        {pos: 6, name: '圖書館', type: 'academic'},
        {pos: 7, name: '運動', type: 'life'},
        {pos: 8, name: '職涯', type: 'career'},
        {pos: 9, name: '宿舍', type: 'life'},
        {pos: 10, name: '獎學金', type: 'financial'},
        {pos: 11, name: '教室 B', type: 'academic'},
        {pos: 12, name: '學生會', type: 'life'},
        {pos: 13, name: '書店', type: 'financial'},
        {pos: 14, name: '實習', type: 'career'},
        {pos: 15, name: '咖啡店', type: 'financial'},
        {pos: 16, name: '讀書會', type: 'academic'},
        {pos: 17, name: '健康', type: 'life'},
        {pos: 18, name: '交流', type: 'career'},
        {pos: 19, name: '考試', type: 'academic'},
        {pos: 20, name: '助學金', type: 'financial'},
        {pos: 21, name: '活動', type: 'life'},
        {pos: 22, name: '工作坊', type: 'career'},
        {pos: 23, name: '教授', type: 'academic'},
        {pos: 24, name: '面試', type: 'career'},
        {pos: 25, name: '志工', type: 'life'},
        {pos: 26, name: '投資', type: 'financial'},
        {pos: 27, name: '畢業典禮', type: 'graduation'},
        {pos: 28, name: '企業', type: 'career'},
        {pos: 29, name: '文化節', type: 'life'},
        {pos: 30, name: '預算', type: 'financial'},
        {pos: 31, name: '履歷', type: 'career'},
        {pos: 32, name: '獎項', type: 'academic'},
        {pos: 33, name: '貸款', type: 'financial'},
        {pos: 34, name: 'LinkedIn', type: 'career'},
        {pos: 35, name: '論文', type: 'academic'}
    ],

    randomEvents: [
        // Space 0 - Start (pass through only, no event)
        
        // Space 1 - Classroom A
        {
            id: 1,
            name: '突擊小考',
            description: '教授突然宣布小考！',
            type: 'choice',
            optionA: {
                text: '認真作答',
                successRate: 60,
                successResult: { message: '答對了！', points: 150 },
                failResult: { message: '答錯了', points: -50 }
            },
            optionB: {
                text: '作弊',
                result: { message: '被抓到！', points: -100 }
            },
            triggerSpaces: [1]
        },
        
        // Space 2 - Cafeteria
        {
            id: 2,
            name: '午餐選擇',
            description: '今天吃什麼？',
            type: 'choice',
            optionA: {
                text: '營養午餐',
                successRate: 100,
                successResult: { message: '健康飲食！', points: 50 }
            },
            optionB: {
                text: '省錢不吃',
                result: { message: '肚子好餓...', points: -20 }
            },
            triggerSpaces: [2]
        },
        
        // Space 3 - Bank
        {
            id: 3,
            name: '存款利息',
            description: '銀行提供存款優惠',
            type: 'choice',
            optionA: {
                text: '存錢',
                successRate: 100,
                successResult: { message: '獲得利息！', points: 100 }
            },
            optionB: {
                text: '不存',
                result: { message: '錯過機會', points: 0 }
            },
            triggerSpaces: [3]
        },
        
        // Space 4 - Club + Two Truths
        {
            id: 4,
            name: 'Two Truths and a Lie',
            description: '社團遊戲：說出兩個真相和一個謊言！',
            type: 'host_decision',
            requiresHost: true,
            optionA: {
                text: '玩遊戲',
                successResult: { message: '大家都猜錯了！', points: 300 },
                failResult: { message: '被識破了！', points: 0 }
            },
            optionB: {
                text: '跳過',
                result: { message: '沒參加', points: 0 }
            },
            triggerSpaces: [4]
        },
        
        // Space 5 - Part-time Job
        {
            id: 5,
            name: '打工機會',
            description: '咖啡店正在招募工讀生！接受打工嗎？',
            type: 'choice',
            optionA: {
                text: '接受打工',
                successRate: 50,
                successResult: { message: '遇到好老闆！', points: 200 },
                failResult: { message: '遇到壞老闆！', points: -50 }
            },
            optionB: {
                text: '拒絕',
                result: { message: '專注學業', points: 30 }
            },
            triggerSpaces: [5]
        },
        
        // Space 6 - Library
        {
            id: 6,
            name: '圖書館閱讀',
            description: '在圖書館讀書',
            type: 'choice',
            optionA: {
                text: '認真讀書',
                successRate: 100,
                successResult: { message: '知識增長！', points: 120 }
            },
            optionB: {
                text: '睡覺',
                result: { message: '浪費時間', points: 0 }
            },
            triggerSpaces: [6]
        },
        
        // Space 7 - Sports + Animal Challenge
        {
            id: 7,
            name: '一分鐘挑戰',
            description: '一分鐘內用中文講出十個動物！',
            type: 'host_decision',
            requiresHost: true,
            optionA: {
                text: '接受挑戰',
                successResult: { message: '挑戰成功！', points: 500 },
                failResult: { message: '挑戰失敗', points: 0 }
            },
            optionB: {
                text: '放棄',
                result: { message: '放棄挑戰', points: 0 }
            },
            triggerSpaces: [7]
        },
        
        // Space 8 - Career Center
        {
            id: 8,
            name: '職涯諮詢',
            description: '職涯中心提供免費諮詢',
            type: 'choice',
            optionA: {
                text: '參加諮詢',
                successRate: 100,
                successResult: { message: '獲得建議！', points: 150 }
            },
            optionB: {
                text: '不參加',
                result: { message: '錯過機會', points: 0 }
            },
            triggerSpaces: [8]
        },
        
        // Space 9 - Dorm
        {
            id: 9,
            name: '宿舍派對',
            description: '室友邀請你參加派對',
            type: 'choice',
            optionA: {
                text: '參加',
                successRate: 70,
                successResult: { message: '認識新朋友！', points: 100 },
                failResult: { message: '太吵鬧了', points: -30 }
            },
            optionB: {
                text: '不參加',
                result: { message: '早睡早起', points: 50 }
            },
            triggerSpaces: [9]
        },
        
        // Space 10 - Scholarship
        {
            id: 10,
            name: '獎學金申請',
            description: '發現獎學金申請機會！',
            type: 'choice',
            optionA: {
                text: '立即申請',
                successRate: 40,
                successResult: { message: '獲得獎學金！', points: 400 },
                failResult: { message: '未獲選', points: 0 }
            },
            optionB: {
                text: '放棄',
                result: { message: '沒申請', points: 0 }
            },
            triggerSpaces: [10]
        },
        
        // Space 11 - Classroom B + Caught by Professor
        {
            id: 11,
            name: '被教授抓到',
            description: '教授發現你在課堂上睡覺！',
            type: 'choice',
            optionA: {
                text: '道歉',
                successRate: 100,
                successResult: { message: '下回合停止', points: 0, skipTurn: true }
            },
            optionB: {
                text: '繼續睡',
                result: { message: '被記名，下回合停止', points: -100, skipTurn: true }
            },
            triggerSpaces: [11]
        },
        
        // Space 12 - Student Union
        {
            id: 12,
            name: '學生會選舉',
            description: '要不要參選學生會？',
            type: 'choice',
            optionA: {
                text: '參選',
                successRate: 50,
                successResult: { message: '當選了！', points: 300 },
                failResult: { message: '落選了', points: -50 }
            },
            optionB: {
                text: '不參選',
                result: { message: '當觀眾', points: 0 }
            },
            triggerSpaces: [12]
        },
        
        // Space 13 - Bookstore + Steal
        {
            id: 13,
            name: '偷竊機會',
            description: '你有機會偷取其他玩家的分數！',
            type: 'target_player',
            targetPlayer: true,
            triggerSpaces: [13]
        },
        
        // Space 14 - Internship
        {
            id: 14,
            name: '實習機會',
            description: '公司提供實習機會',
            type: 'choice',
            optionA: {
                text: '接受實習',
                successRate: 100,
                successResult: { message: '獲得經驗！', points: 350 }
            },
            optionB: {
                text: '拒絕',
                result: { message: '繼續學習', points: 50 }
            },
            triggerSpaces: [14]
        },
        
        // Space 15 - Coffee Shop
        {
            id: 15,
            name: '咖啡店消費',
            description: '要不要買咖啡？',
            type: 'choice',
            optionA: {
                text: '買咖啡',
                successRate: 100,
                successResult: { message: '提神了！', points: 50 }
            },
            optionB: {
                text: '不買',
                result: { message: '省錢', points: 20 }
            },
            triggerSpaces: [15]
        },
        
        // Space 16 - Study Group
        {
            id: 16,
            name: '讀書會',
            description: '朋友邀請你加入讀書會',
            type: 'choice',
            optionA: {
                text: '加入',
                successRate: 60,
                successResult: { message: '有效率！', points: 200 },
                failResult: { message: '太多聊天', points: -20 }
            },
            optionB: {
                text: '自己讀',
                result: { message: '安靜專注', points: 100 }
            },
            triggerSpaces: [16]
        },
        
        // Space 17 - Health Center
        {
            id: 17,
            name: '健康檢查',
            description: '健康中心提供免費檢查',
            type: 'choice',
            optionA: {
                text: '接受檢查',
                successRate: 100,
                successResult: { message: '身體健康！', points: 100 }
            },
            optionB: {
                text: '不檢查',
                result: { message: '錯過機會', points: 0 }
            },
            triggerSpaces: [17]
        },
        
        // Space 18 - Networking
        {
            id: 18,
            name: '交流活動',
            description: '參加業界交流活動',
            type: 'choice',
            optionA: {
                text: '參加',
                successRate: 100,
                successResult: { message: '建立人脈！', points: 180 }
            },
            optionB: {
                text: '不參加',
                result: { message: '宅在家', points: 0 }
            },
            triggerSpaces: [18]
        },
        
        // Space 19 - Exam
        {
            id: 19,
            name: '期中考',
            description: '期中考試週到了！',
            type: 'choice',
            optionA: {
                text: '全力準備',
                successRate: 70,
                successResult: { message: '高分通過！', points: 250 },
                failResult: { message: '勉強及格', points: 50 }
            },
            optionB: {
                text: '裸考',
                result: { message: '不及格...', points: -100 }
            },
            triggerSpaces: [19]
        },
        
        // Space 20 - Financial Aid
        {
            id: 20,
            name: '助學金',
            description: '申請助學金',
            type: 'choice',
            optionA: {
                text: '申請',
                successRate: 60,
                successResult: { message: '通過審核！', points: 300 },
                failResult: { message: '未通過', points: 0 }
            },
            optionB: {
                text: '不申請',
                result: { message: '沒申請', points: 0 }
            },
            triggerSpaces: [20]
        },
        
        // Space 21 - Campus Event + Two Truths
        {
            id: 21,
            name: '校園活動遊戲',
            description: 'Two Truths and a Lie遊戲時間！',
            type: 'host_decision',
            requiresHost: true,
            optionA: {
                text: '參加',
                successResult: { message: '贏得遊戲！', points: 250 },
                failResult: { message: '輸了', points: 0 }
            },
            optionB: {
                text: '不參加',
                result: { message: '錯過活動', points: 0 }
            },
            triggerSpaces: [21]
        },
        
        // Space 22 - Workshop
        {
            id: 22,
            name: '技能工作坊',
            description: '參加技能培訓',
            type: 'choice',
            optionA: {
                text: '參加',
                successRate: 100,
                successResult: { message: '學到新技能！', points: 200 }
            },
            optionB: {
                text: '不參加',
                result: { message: '錯過學習', points: 0 }
            },
            triggerSpaces: [22]
        },
        
        // Space 23 - Professor + Caught
        {
            id: 23,
            name: '被教授抓到',
            description: '上課遲到被教授看到！',
            type: 'choice',
            optionA: {
                text: '道歉',
                successRate: 100,
                successResult: { message: '下回合停止', points: -50, skipTurn: true }
            },
            optionB: {
                text: '找藉口',
                result: { message: '教授生氣，下回合停止', points: -150, skipTurn: true }
            },
            triggerSpaces: [23]
        },
        
        // Space 24 - Interview
        {
            id: 24,
            name: '模擬面試',
            description: '參加模擬面試練習',
            type: 'choice',
            optionA: {
                text: '參加',
                successRate: 100,
                successResult: { message: '表現優秀！', points: 220 }
            },
            optionB: {
                text: '不參加',
                result: { message: '缺乏練習', points: 0 }
            },
            triggerSpaces: [24]
        },
        
        // Space 25 - Volunteer
        {
            id: 25,
            name: '志工服務',
            description: '參加志工活動',
            type: 'choice',
            optionA: {
                text: '參加',
                successRate: 100,
                successResult: { message: '服務社會！', points: 150 }
            },
            optionB: {
                text: '不參加',
                result: { message: '待在家', points: 0 }
            },
            triggerSpaces: [25]
        },
        
        // Space 26 - Investment + Steal
        {
            id: 26,
            name: '投資競爭',
            description: '股市競爭！可以偷取對手分數',
            type: 'target_player',
            targetPlayer: true,
            triggerSpaces: [26]
        },
        
        // Space 27 - Graduation (Special - Game Ends)
        {
            id: 27,
            name: '畢業典禮',
            description: '恭喜畢業！',
            type: 'graduation',
            triggerSpaces: [27]
        },
        
        // Space 28 - Company Visit
        {
            id: 28,
            name: '企業參訪',
            description: '參觀知名企業',
            type: 'choice',
            optionA: {
                text: '參加',
                successRate: 100,
                successResult: { message: '開拓視野！', points: 180 }
            },
            optionB: {
                text: '不參加',
                result: { message: '錯過機會', points: 0 }
            },
            triggerSpaces: [28]
        },
        
        // Space 29 - Cultural Festival + Animal Challenge
        {
            id: 29,
            name: '文化節挑戰',
            description: '一分鐘講出十個國家！',
            type: 'host_decision',
            requiresHost: true,
            optionA: {
                text: '接受挑戰',
                successResult: { message: '挑戰成功！', points: 400 },
                failResult: { message: '挑戰失敗', points: 0 }
            },
            optionB: {
                text: '放棄',
                result: { message: '沒參加', points: 0 }
            },
            triggerSpaces: [29]
        },
        
        // Space 30 - Budget Planning
        {
            id: 30,
            name: '預算規劃',
            description: '學習理財規劃',
            type: 'choice',
            optionA: {
                text: '認真學習',
                successRate: 100,
                successResult: { message: '理財能力提升！', points: 160 }
            },
            optionB: {
                text: '不學',
                result: { message: '錯過學習', points: 0 }
            },
            triggerSpaces: [30]
        },
        
        // Space 31 - Resume
        {
            id: 31,
            name: '履歷製作',
            description: '製作個人履歷',
            type: 'choice',
            optionA: {
                text: '用心製作',
                successRate: 100,
                successResult: { message: '履歷完美！', points: 200 }
            },
            optionB: {
                text: '隨便做',
                result: { message: '品質不佳', points: 50 }
            },
            triggerSpaces: [31]
        },
        
        // Space 32 - Academic Award
        {
            id: 32,
            name: '學術獎項',
            description: '獲得學術獎項提名',
            type: 'choice',
            optionA: {
                text: '準備競賽',
                successRate: 50,
                successResult: { message: '獲獎了！', points: 500 },
                failResult: { message: '未獲獎', points: 50 }
            },
            optionB: {
                text: '不參加',
                result: { message: '放棄機會', points: 0 }
            },
            triggerSpaces: [32]
        },
        
        // Space 33 - Student Loan + Steal
        {
            id: 33,
            name: '貸款陷阱',
            description: '可以搶奪對手資金！',
            type: 'target_player',
            targetPlayer: true,
            triggerSpaces: [33]
        },
        
        // Space 34 - LinkedIn
        {
            id: 34,
            name: 'LinkedIn經營',
            description: '建立職業形象',
            type: 'choice',
            optionA: {
                text: '認真經營',
                successRate: 100,
                successResult: { message: '人脈增加！', points: 220 }
            },
            optionB: {
                text: '不經營',
                result: { message: '錯過機會', points: 0 }
            },
            triggerSpaces: [34]
        },
        
        // Space 35 - Thesis (Year 3)
        {
            id: 35,
            name: '論文答辯',
            description: '畢業論文答辯！',
            type: 'choice',
            optionA: {
                text: '全力以赴',
                successRate: 70,
                successResult: { message: '答辯成功！', points: 400 },
                failResult: { message: '勉強通過', points: 100 }
            },
            optionB: {
                text: '隨便應付',
                result: { message: '表現不佳', points: -50 }
            },
            triggerSpaces: [35]
        }
    ],

    questions: [
        {
            id: 1,
            category: 'academic',
            text: '哪種學習方法最有效於長期記憶？',
            options: [
                {label: 'A', text: '考前臨時抱佛腳'},
                {label: 'B', text: '間隔重複學習'},
                {label: 'C', text: '只讀一次'},
                {label: 'D', text: '全部畫重點'}
            ],
            correctAnswer: 'B',
            explanation: '間隔重複學習讓大腦有時間鞏固記憶',
            points: 150
        },
        {
            id: 2,
            category: 'financial',
            text: '你有2000元存款，3個月後要繳學費，最好的選擇是？',
            options: [
                {label: 'A', text: '投資高風險股票'},
                {label: 'B', text: '存在儲蓄帳戶'},
                {label: 'C', text: '買新電腦'},
                {label: 'D', text: '借給朋友'}
            ],
            correctAnswer: 'B',
            explanation: '短期需要的錢應該保持安全和流動性',
            points: 100
        },
        {
            id: 3,
            category: 'career',
            text: '在社交活動中，最好的交流方式是？',
            options: [
                {label: 'A', text: '到處發履歷'},
                {label: 'B', text: '積極傾聽並提問'},
                {label: 'C', text: '只談論自己'},
                {label: 'D', text: '保持安靜'}
            ],
            correctAnswer: 'B',
            explanation: '積極傾聽和有意義的提問能建立真正的連結',
            points: 150
        },
        {
            id: 4,
            category: 'cultural',
            text: '泰北華校的教育理念強調什麼？',
            options: [
                {label: 'A', text: '競爭至上'},
                {label: 'B', text: '中華文化傳承與多元發展'},
                {label: 'C', text: '只注重考試成績'},
                {label: 'D', text: '完全西方化教育'}
            ],
            correctAnswer: 'B',
            explanation: '泰北華校重視文化傳承的同時促進學生全面發展',
            points: 200
        },
        {
            id: 5,
            category: 'academic',
            text: '寫論文時，最重要的第一步是？',
            options: [
                {label: 'A', text: '直接開始寫'},
                {label: 'B', text: '研究和規劃大綱'},
                {label: 'C', text: '抄襲他人作品'},
                {label: 'D', text: '等到最後一刻'}
            ],
            correctAnswer: 'B',
            explanation: '充分的研究和清晰的大綱是成功論文的基礎',
            points: 120
        }
    ]
};
