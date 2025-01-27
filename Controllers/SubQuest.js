const prisma = require('../Config/Prisma')


exports.createSubQuest = async (req, res) => {
    try {
        //Code
        const {
            sub_quest_name,
            sub_quest_total_point,
            sub_quest_require_point,
            description,
            necessary,
            questId,
            category_questId
        } = req.body

        const sub_quest = await prisma.sub_quest.findFirst({
            where: { sub_quest_name: sub_quest_name }
        })

        if (sub_quest) {
            return res.status(400).json({
                message: `มีชุดคำถามนี้อยู่ในระบบแล้ว กรุณาเพิ่มชุดคำถามใหม่!`
            })
        }

        await prisma.sub_quest.create({
            data: {
                sub_quest_name: sub_quest_name,
                sub_quest_total_point: sub_quest_total_point,
                sub_quest_require_point: sub_quest_require_point,
                description: description,
                necessary: necessary,
                questId: questId,
                category_questId: category_questId
            }
        })
        res.json({
            message: `เพิ่มข้อมูลชุดคำถามเรียบร้อยแล้ว!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

//Create Sub_quest_list
exports.createSubQuestList = async (req, res) => {
    try {
        //Code
        const Values = req.body.map((item) => ({
            sub_questId: item.sub_questId,
            sub_quest_listname: item.sub_quest_listname,
            sub_quest_total_point: item.sub_quest_total_point,
            sub_quest_require_point: item.sub_quest_require_point,
            description: item.description,
            necessary: item.necessary
        }))

        await prisma.sub_quest_list.createMany({
            data: Values
        })

        res.json({
            message: `เพิ่มข้อมูลชุดคำถามเรียบร้อยแล้ว!`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

exports.getListSubQuests = async (req, res) => {
    try {
        //Code
        const sub_quest = await prisma.sub_quest.findMany({
            include: {
                category_quests: {
                    select: {
                        id: true,
                        category_name_th: true,
                        category_name_eng: true,
                        fiscal_year: true
                    }
                },
                quests: {
                    select: {
                        id: true,
                        quest_name: true
                    }
                }
            }
        })
        res.json(sub_quest)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}


exports.getListSubQuestsForEvaluate = async (req, res) => {
    try {
        //Code
        const { questId } = req.params
        const sub_quest = await prisma.sub_quest.findMany({
            where: { questId: Number(questId) },
            include: {
                category_quests: {
                    select: {
                        id: true,
                        category_name_th: true,
                        category_name_eng: true,
                        fiscal_year: true
                    }
                },
                quests: {
                    select: {
                        id: true,
                        quest_name: true
                    }
                },
                // evaluates: {
                //     select:{
                //         id:true,
                //         category_questId:true,
                //         questId: true,
                //         sub_questId: true
                //     }
                // },
                sub_quest_lists: {
                    select: {
                        id: true,
                        sub_questId: true,
                        choice: true,
                        sub_quest_listname: true,
                        sub_quest_total_point: true,
                        sub_quest_require_point: true,
                        description: true,
                        necessary: true
                    }
                }
            }
        })
        res.json(sub_quest)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

exports.getSubQuestById = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const sub_quest = await prisma.sub_quest.findFirst({
            where: { id: Number(id) }
        })
        res.json(sub_quest)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}


exports.getSubQuestList = async (req, res) => {
    try {
        //Code
        const { sub_questId } = req.query
        const sub_quest_list = await prisma.sub_quest_list.findMany({
            where: { sub_questId: Number(sub_questId) }
        })
        res.json(sub_quest_list)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}


exports.getSubQuestByCatId = async (req, res) => {
    try {
        //Code
        const { category_questId } = req.query
        const sub_quest = await prisma.sub_quest.findMany({
            where: { category_questId: Number(category_questId) }
        })
        res.json(sub_quest)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

exports.updateSubQuest = async (req, res) => {
    try {
        //Code
        const {
            id,
            sub_quest_name,
            sub_quest_total_point,
            sub_quest_require_point,
            description,
            necessary,
            questId,
            category_questId
        } = req.body

        const sub_quest = await prisma.sub_quest.update({
            where: { id: Number(id) },
            data: {
                sub_quest_name: sub_quest_name,
                sub_quest_total_point: sub_quest_total_point,
                sub_quest_require_point: sub_quest_require_point,
                description: description,
                necessary: necessary,
                questId: questId,
                category_questId: category_questId,
                updatedAt: new Date()
            }
        })
        res.json({ message: `แก้ไขข้อมูล${sub_quest.sub_quest_name} สำเร็จ` })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

exports.removeSubQuest = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const sub_quest = await prisma.sub_quest.delete({
            where: { id: Number(id) }
        })
        res.json({ message: `ลบข้อมูล ${sub_quest.sub_quest_name} สำเร็จ!` })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}