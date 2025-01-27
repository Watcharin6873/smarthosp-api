const prisma = require('../Config/Prisma')


exports.createQuests = async (req, res) => {
    try {
        //Code
        const queatValues = req.body.map((item) => ({
            quest_name: item.quest_name,
            category_questId: item.category_questId
        }))

        await prisma.quest.createMany({
            data: queatValues
        })
        res.json({ message: `เพิ่มข้อมูลสำเร็จ!` })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

exports.getListQuests = async (req, res) => {
    try {
        //Code
        const quest = await prisma.quest.findMany({
            include: {
                category_quests: {
                    select: {
                        id: true,
                        category_name_eng: true,
                        category_name_th: true,
                        fiscal_year: true
                    }
                }
            },
            orderBy: {
                id: 'asc'
            }
        })
        res.json(quest)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Serveer error!"
        })
    }
}

exports.getQuestById = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const quest = await prisma.quest.findFirst({
            where: { id: Number(id) }
        })
        res.json(quest)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Serveer error!"
        })
    }
}

exports.updateQuests = async (req, res) => {
    try {
        //Code
        const { id, quest_name, category_questId } = req.body
        const quest = await prisma.quest.update({
            where: { id: Number(id) },
            data: {
                quest_name: quest_name,
                category_questId: category_questId,
                updatedAt: new Date()
            }
        })
        // res.send("Update quest success!")
        res.json({ message: `แก้ไขข้อมูลสำเร็จ!` })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Serveer error!"
        })
    }
}

exports.removeQuests = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        await prisma.quest.delete({ where: { id: Number(id) } })
        res.json({ message: `ลบข้อมูลสำเร็จ!` })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Serveer error!"
        })
    }
}