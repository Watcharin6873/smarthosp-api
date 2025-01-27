const prisma = require('../Config/Prisma')


exports.createSubQuestList2 = async (req, res) => {
    try {
        //Code
        const {
            sub_questId,
            choice,
            sub_quest_listname,
            sub_quest_total_point,
            sub_quest_require_point,
            description
        } = req.body

        await prisma.sub_quest_list.create({
            data: {
                sub_questId: Number(sub_questId),
                choice: choice,
                sub_quest_listname: sub_quest_listname,
                sub_quest_total_point: Number(sub_quest_total_point),
                sub_quest_require_point: Number(sub_quest_require_point),
                description: description
            }
        })

        res.json({
            message: 'บันทึกข้อมูลสำเร็จ!!'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error!!" })
    }
}


exports.getSubQuetList = async (req, res) => {
    try {
        //Code
        const result = await prisma.sub_quest_list.findMany()

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error!!" })
    }
}