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
        {pos: 27, name: '論文', type: 'academic'},
        {pos: 28, name: '企業', type: 'career'},
        {pos: 29, name: '文化節', type: 'life'},
        {pos: 30, name: '預算', type: 'financial'},
        {pos: 31, name: '履歷', type: 'career'},
        {pos: 32, name: '獎項', type: 'academic'},
        {pos: 33, name: '貸款', type: 'financial'},
        {pos: 34, name: 'LinkedIn', type: 'career'},
        {pos: 35, name: '錄取', type: 'career'}
    ],

    randomEvents: [
        {
            id: 1,
            name: '打工機會',
            description: '一家咖啡店正在招募工讀生！',
            type: 'choice',
            optionA: {
                text: '接受工作',
                successRate: 50,
                successResult: {
                    message: '遇到好老闆！',
                    points: 150
                },
                failResult: {
                    message: '遇到壞老闆！',
                    points: -20
                }
            },
            optionB: {
                text: '拒絕',
                result: {
                    message: '專注學業',
                    points: 5
                }
            },
            triggerSpaces: [5, 15, 25]
        },
        {
            id: 2,
            name: '被教授抓到',
            description: '教授發現你在課堂上睡覺！',
            type: 'choice',
            optionA: {
                text: '道歉',
                successRate: 100,
                successResult: {
                    message: '下回合停止一次',
                    points: 0,
                    skipTurn: true
                },
                failResult: {
                    message: '下回合停止一次',
                    points: 0,
                    skipTurn: true
                }
            },
            optionB: {
                text: '繼續睡',
                result: {
                    message: '被記名，下回合停止',
                    points: -50,
                    skipTurn: true
                }
            },
            triggerSpaces: [1, 11, 23]
        },
        {
            id: 3,
            name: '一分鐘挑戰',
            description: '一分鐘內用中文講出十個動物！',
            type: 'host_decision',
            requiresHost: true,
            optionA: {
                text: '開始挑戰',
                successResult: {
                    message: '挑戰成功！',
                    points: 500
                },
                failResult: {
                    message: '挑戰失敗',
                    points: 0
                }
            },
            optionB: {
                text: '放棄',
                result: {
                    message: '放棄挑戰',
                    points: 0
                }
            },
            triggerSpaces: [7, 17, 29]
        },
        {
            id: 4,
            name: '偷竊機會',
            description: '你有機會偷取其他玩家的分數！',
            type: 'target_player',
            targetPlayer: true,
            optionA: {
                text: '選擇玩家',
                successRate: 100,
                successResult: {
                    message: '成功偷取200分！',
                    points: 200
                }
            },
            optionB: {
                text: '放棄',
                result: {
                    message: '保持誠實',
                    points: 50
                }
            },
            triggerSpaces: [13, 26, 33]
        },
        {
            id: 5,
            name: 'Two Truths and a Lie',
            description: '說出兩個真相和一個謊言！',
            type: 'host_decision',
            requiresHost: true,
            optionA: {
                text: '開始遊戲',
                successResult: {
                    message: '其他玩家猜錯了！',
                    points: 300
                },
                failResult: {
                    message: '被識破了！',
                    points: 0
                }
            },
            optionB: {
                text: '跳過',
                result: {
                    message: '跳過遊戲',
                    points: 0
                }
            },
            triggerSpaces: [4, 12, 21]
        },
        {
            id: 6,
            name: '讀書會',
            description: '朋友邀請你加入讀書會',
            type: 'choice',
            optionA: {
                text: '加入',
                successRate: 60,
                successResult: {
                    message: '有效率！',
                    points: 200
                },
                failResult: {
                    message: '太多聊天',
                    points: -10
                }
            },
            optionB: {
                text: '自己讀',
                result: {
                    message: '安靜專注',
                    points: 100
                }
            },
            triggerSpaces: [16, 27]
        },
        {
            id: 7,
            name: '獎學金',
            description: '發現獎學金申請機會！',
            type: 'choice',
            optionA: {
                text: '立即申請',
                successRate: 40,
                successResult: {
                    message: '獲得獎學金！',
                    points: 300
                },
                failResult: {
                    message: '未獲選',
                    points: 0
                }
            },
            optionB: {
                text: '放棄',
                result: {
                    message: '沒有變化',
                    points: 0
                }
            },
            triggerSpaces: [10, 20, 30]
        },
        {
            id: 8,
            name: '實習招聘會',
            description: '校園正在舉辦實習招聘會！',
            type: 'choice',
            optionA: {
                text: '參加',
                successRate: 45,
                successResult: {
                    message: '獲得面試！',
                    points: 500
                },
                failResult: {
                    message: '沒有回音',
                    points: 5
                }
            },
            optionB: {
                text: '跳過',
                result: {
                    message: '錯過機會',
                    points: 0
                }
            },
            triggerSpaces: [14, 24, 34]
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
