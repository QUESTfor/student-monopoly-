randomEvents: [
    {
        id: 1,
        name: '打工機會 Part-Time Job',
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
        name: '被教授抓到 Caught by Professor!',
        description: '教授發現你在課堂上睡覺！',
        type: 'choice',
        optionA: {
            text: '道歉',
            successRate: 100,
            successResult: {
                message: '下回合停止一次',
                points: 0,
                skipTurn: true
            }
        },
        optionB: {
            text: '繼續睡',
            result: {
                message: '被教授記名，下回合停止一次',
                points: -50,
                skipTurn: true
            }
        },
        triggerSpaces: [1, 11, 23]
    },
    {
        id: 3,
        name: '一分鐘挑戰 1-Minute Challenge',
        description: '一分鐘內用中文講出十個動物！',
        type: 'host_decision',
        requiresHost: true,
        optionA: {
            text: 'Start Challenge',
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
            text: 'Skip',
            result: {
                message: '放棄挑戰',
                points: 0
            }
        },
        triggerSpaces: [7, 17, 29]
    },
    {
        id: 4,
        name: '偷竊機會 Steal Opportunity',
        description: '你有機會偷取其他玩家的分數！',
        type: 'target_player',
        targetPlayer: true,
        optionA: {
            text: 'Choose player to steal from',
            successRate: 100,
            successResult: {
                message: '成功偷取200分！',
                points: 200
            }
        },
        optionB: {
            text: 'Skip',
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
            text: 'Play Game',
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
            text: 'Skip',
            result: {
                message: '跳過遊戲',
                points: 0
            }
        },
        triggerSpaces: [4, 12, 21]
    },
    {
        id: 6,
        name: '讀書會 Study Group',
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
        name: '獎學金 Scholarship',
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
        name: '實習招聘會 Internship Fair',
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
