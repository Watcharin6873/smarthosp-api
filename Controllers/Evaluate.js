const prisma = require('../Config/Prisma')
const fs = require('fs')
// const baseDir = require('../file-uploads')


exports.saveEvaluates = async (req, res) => {
    try {
        //Code
        const questValues = req.body.map((item) => ({
            category_questId: item.category_questId,
            questId: item.questId,
            sub_questId: item.sub_questId,
            check: String(item.check),
            hcode: item.hcode,
            userId: item.userId
        }))

        // console.log('Data: ', questValues)
        // const check = await prisma.evaluate.findFirst({
        //     where:{
        //         hcode: req.body.map(f=> f.hcode),
        //         sub_questId: req.body.map(f=> f.sub_questId)
        //     }
        // })

        const saveData = await prisma.evaluate.createMany({
            data: questValues
        })
        if (saveData) {
            const log = await prisma.evaluate.findMany({
                where: { createdAt: new Date() },
                select: {
                    id: true,
                    userId: true,
                    hcode: true,
                    hospitals: {
                        select: {
                            id: true,
                            hcode: true,
                            hname_th: true,
                            provname: true,
                            zone: true
                        }
                    }
                }
            })

            const logValue = log.map((item2) => ({
                evaluateId: item2.id,
                usersId: Number(item2.userId),
                hcode: item2.hcode,
                province: item2.hospitals.provname,
                zone: item2.hospitals.zone
            }))

            await prisma.log_evaluate.createMany({
                data: logValue
            })


        }
        res.json({ message: `ประเมินผลสำเร็จ!` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.saveEvaluates2 = async (req, res) => {
    try {
        //Code
        const data = req.body
        data.file_name = req.file.filename

        console.log('Data: ', data)

        await prisma.evaluate.create({
            data: {
                category_questId: Number(data.category_questId),
                questId: Number(data.questId),
                sub_questId: Number(data.sub_questId),
                check: String(data.check),
                hcode: data.hcode,
                userId: Number(data.userId),
                file_name: data.file_name
            }
        })
        res.json({ message: `ประเมินผลสำเร็จ!` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getHospitalInListEvaluate = async (req, res) => {
    try {
        //Code
        const result = await prisma.$queryRaw`SELECT tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,tb1.sub_quest_total_point,
                            tb1.sub_quest_require_point,tb1.cyber_level,tb1.cyber_levelname,tb1.typename
                        FROM (SELECT t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th,SUM(sub_quest_total_point) AS sub_quest_total_point,
                            SUM(sub_quest_require_point) AS sub_quest_require_point,t1.cyber_level, t1.cyber_levelname,t2.typename
                        FROM Sum_approve_evaluate AS t1 INNER JOIN Hospitals AS t2 ON t1.hcode = t2.hcode COLLATE utf8mb4_unicode_ci
                        WHERE t2.typename IN ('โรงพยาบาลศูนย์','โรงพยาบาลทั่วไป','โรงพยาบาลชุมชน')
                        GROUP BY t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th,t1.cyber_level, t1.cyber_levelname,t2.typename
                        ORDER BY CAST(t2.zone AS UNSIGNED), t2.provcode ASC) AS tb1`

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getListEvaluateByHosp = async (req, res) => {
    try {
        //Code
        const { hcode } = req.params
        const result = await prisma.$queryRaw`SELECT t1.id,t1.category_questId,t1.questId,t1.sub_questId,t3.sub_quest_name,
                t1.check,t1.hcode,t1.file_name,t2.id AS sub_quest_listId,t2.sub_quest_listname,t2.sub_quest_total_point,	
                t2.sub_quest_require_point,t2.description,t2.necessary,t1.createdAt,t1.updatedAt
                FROM Evaluate t1 
                LEFT JOIN Sub_quest_list t2 
                ON t1.sub_questId = t2.sub_questId AND t1.check = t2.choice
                LEFT JOIN Sub_quest AS t3 
                ON t1.sub_questId = t3.id
                WHERE hcode = ${hcode}`

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getListEvaluateByHosp2 = async (req, res) => {
    try {
        //Code
        const { hcode } = req.params

        const result = await prisma.evaluate.findMany({
            where: { hcode: hcode },
            select: {
                id: true,
                category_questId: true,
                questId: true,
                sub_questId: true,
                sub_quests: {
                    select: {
                        id: true,
                        sub_quest_name: true,
                        necessary: true
                    }
                },
                check: true,
                hcode: true,
                userId: true,
                file_name: true,
                ssj_approve: true,
                zone_approve: true,
                createdAt: true,
                updatedAt: true
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.getEvaluateByHosp = async (req, res) => {
    try {
        const { questId, hcode } = req.query
        console.log(req.query)
        const result = await prisma.evaluate.findMany({
            where: {
                AND: [
                    { questId: Number(questId) },
                    { hcode: hcode }
                ]
            }
        })

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getEvaluateByHosp2 = async (req, res) => {
    try {
        const { hcode } = req.query
        console.log(req.query)
        const result = await prisma.evaluate.findMany({
            where: { hcode: hcode },
            select: {
                id: true,
                questId: true,
                sub_questId: true,
                check: true,
                hcode: true,
                userId: true,
                hospitals: {
                    select: {
                        hcode: true,
                        hname_th: true,
                        provcode: true,
                        provname: true,
                        zone: true
                    }
                }
            }
        })

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getEvaluateByHosp3 = async (req, res) => {
    try {
        //Code
        const { category_questId, hcode } = req.query
        const listType = ['โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน'];
        const result = await prisma.evaluate.findMany({
            select: {
                id: true,
                file_name: true,
                ssj_approve: true,
                zone_approve: true,
                category_questId: true,
                category_quests: {
                    select: {
                        id: true,
                        category_name_th: true,
                        fiscal_year: true
                    }
                },
                questId: true,
                quests: {
                    select: {
                        id: true,
                        quest_name: true
                    }
                },
                sub_questId: true,
                sub_quests: {
                    select: {
                        id: true,
                        sub_quest_name: true,
                        sub_quest_lists: true
                    }
                },
                check: true,
                userId: true,
                users: {
                    select: {
                        id: true,
                        firstname_th: true,
                        lastname_th: true
                    }
                },
                hcode: true,
                hospitals: {
                    select: {
                        id: true,
                        hcode: true,
                        hname_th: true,
                        tmbname: true,
                        ampname: true,
                        provcode: true,
                        provname: true,
                        zone: true
                    }
                }
            },
            where: {
                hospitals: {
                    is: {
                        hcode: hcode,
                        typename: {
                            in: listType
                        }
                    }
                },
                category_questId: Number(category_questId)
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getEvaluateForChart = async (req, res) => {
    try {
        const result = await prisma.$queryRaw`SELECT provcode,provname,gemlevel,
                                goldlevel, silverlevel, notpasslevel,
                                total_hosp FROM Result_evaluate_forchart
                                ORDER BY CAST(provcode AS UNSIGNED) ASC`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getEvaluateForBarChartStackZone = async (req, res) => {
    try {
        const { zone } = req.query

        const result = await prisma.$queryRaw`SELECT provcode,provname,gemlevel,
                                goldlevel, silverlevel, notpasslevel,
                                total_hosp FROM Result_evaluate_forchart
                                WHERE zone = ${zone} ORDER BY CAST(provcode AS UNSIGNED) ASC`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.sumEvaluateAll = async (req, res) => {
    try {
        //Code
        const result = await prisma.$queryRaw`SELECT t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th,SUM(sub_quest_total_point) AS sub_quest_total_point,
                            SUM(sub_quest_require_point) AS sub_quest_require_point,t1.cyber_level, t1.cyber_levelname
                        FROM Hospitals AS t2 INNER JOIN Sum_approve_evaluate AS t1 ON t1.hcode = t2.hcode COLLATE utf8mb4_unicode_ci
                        WHERE t2.typename IN ('โรงพยาบาลศูนย์','โรงพยาบาลทั่วไป','โรงพยาบาลชุมชน')
                        GROUP BY t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th,t1.cyber_level, t1.cyber_levelname
                        ORDER BY CAST(t2.zone AS UNSIGNED), t2.provcode ASC`

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.sumEvaluateByHosp = async (req, res) => {
    try {
        //Code
        const { hcode } = req.query

        const result = await prisma.$queryRaw`SELECT t1.category_questId, SUM(t2.total_point) AS total_point, SUM(t2.require_point) AS require_point
                        FROM Sub_quest AS t1 LEFT JOIN (SELECT t1.category_questId, t2.sub_questId, SUM(t2.sub_quest_total_point) AS total_point,
                            SUM(t2.sub_quest_require_point) AS require_point
                        FROM Evaluate AS t1 INNER JOIN Sub_quest_list AS t2 ON t1.sub_questId = t2.sub_questId AND t1.check = t2.choice
                        WHERE t1.hcode = ${hcode} GROUP BY t1.category_questId,	t2.sub_questId) AS t2
                        ON t1.id = t2.sub_questId AND t1.category_questId = t2.category_questId GROUP BY t1.category_questId`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getListEvaluateAll = async (req, res) => {
    try {
        //Code
        const result = await prisma.evaluate.findMany({
            select: {
                id: true,
                file_name: true,
                ssj_approve: true,
                zone_approve: true,
                category_quests: {
                    select: {
                        id: true,
                        category_name_th: true,
                        fiscal_year: true
                    }
                },
                quests: {
                    select: {
                        id: true,
                        quest_name: true
                    }
                },
                sub_quests: {
                    select: {
                        id: true,
                        sub_quest_name: true,
                        sub_quest_lists: true
                    }
                },
                check: true,
                users: {
                    select: {
                        id: true,
                        firstname_th: true,
                        lastname_th: true
                    }
                },
                hcode: true,
                hospitals: {
                    select: {
                        id: true,
                        hcode: true,
                        hname_th: true,
                        tmbname: true,
                        ampname: true,
                        provname: true,
                        zone: true
                    }
                }
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.getListEvaluateByProv = async (req, res) => {
    try {
        //Code
        const { province } = req.params
        const listType = ['โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน'];  //,'หน่วยงานทดสอบระบบ'
        const result = await prisma.evaluate.findMany({
            select: {
                id: true,
                file_name: true,
                ssj_approve: true,
                zone_approve: true,
                category_questId: true,
                category_quests: {
                    select: {
                        id: true,
                        category_name_th: true,
                        fiscal_year: true
                    }
                },
                questId: true,
                quests: {
                    select: {
                        id: true,
                        quest_name: true
                    }
                },
                sub_questId: true,
                sub_quests: {
                    select: {
                        id: true,
                        sub_quest_name: true,
                        necessary: true,
                        sub_quest_lists: true
                    }
                },
                check: true,
                userId: true,
                users: {
                    select: {
                        id: true,
                        firstname_th: true,
                        lastname_th: true
                    }
                },
                hcode: true,
                hospitals: {
                    select: {
                        id: true,
                        hcode: true,
                        hname_th: true,
                        tmbname: true,
                        ampname: true,
                        provcode: true,
                        provname: true,
                        zone: true
                    }
                }
            },
            where: {
                hospitals: {
                    is: {
                        provname: province,
                        typename: {
                            in: listType
                        }
                    }
                }
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.getListEvaluateByZone = async (req, res) => {
    try {
        //Code
        const { zone } = req.params
        const listType = ['โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน'];
        const result = await prisma.evaluate.findMany({
            select: {
                id: true,
                file_name: true,
                ssj_approve: true,
                zone_approve: true,
                category_questId: true,
                category_quests: {
                    select: {
                        id: true,
                        category_name_th: true,
                        fiscal_year: true
                    }
                },
                questId: true,
                quests: {
                    select: {
                        id: true,
                        quest_name: true
                    }
                },
                sub_questId: true,
                sub_quests: {
                    select: {
                        id: true,
                        sub_quest_name: true,
                        necessary: true,
                        sub_quest_lists: true
                    }
                },
                check: true,
                userId: true,
                users: {
                    select: {
                        id: true,
                        firstname_th: true,
                        lastname_th: true
                    }
                },
                hcode: true,
                hospitals: {
                    select: {
                        id: true,
                        hcode: true,
                        hname_th: true,
                        tmbname: true,
                        ampname: true,
                        provcode: true,
                        provname: true,
                        zone: true
                    }
                }
            },
            where: {
                hospitals: {
                    is: {
                        zone: zone,
                        typename: {
                            in: listType
                        }
                    }
                }
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.refreshEvaluate = async (req, res) => {
    try {
        //Code
        const { category_questId, hcode } = req.query
        console.log(req.query)
        const result = await prisma.evaluate.findMany({
            where: {
                AND: [
                    { category_questId: Number(category_questId) },
                    { hcode: hcode }
                ]
            },
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
                sub_quests: {
                    select: {
                        id: true,
                        sub_quest_name: true
                    }
                }
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.getEvaluateById = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const result = await prisma.evaluate.findFirst({
            where: { id: Number(id) },
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
                sub_quests: {
                    select: {
                        id: true,
                        sub_quest_name: true,
                        sub_quest_lists: {
                            select: {
                                id: true,
                                sub_questId: true,
                                sub_quest_listname: true,
                                sub_quest_total_point: true,
                                sub_quest_require_point: true,
                                choice: true
                            }
                        }
                    }
                }
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.updateChoiceEvaluate = async (req, res) => {
    try {
        //Code
        const {
            id,
            check,
            userId
        } = req.body

        await prisma.evaluate.update({
            where: { id: Number(id) },
            data: {
                check: String(check),
                ssj_approve: false,
                zone_approve: false,
                userId: userId,
                updatedAt: new Date()
            }
        })

        const evaluate = await prisma.evaluate.findFirst({
            where: { id: Number(id) },
            select: {
                id: true,
                category_questId: true,
                questId: true,
                sub_questId: true,
                check: true,
                hcode: true,
                userId: true,
                hospitals: {
                    select: {
                        hcode: true,
                        hname_th: true,
                        provcode: true,
                        provname: true,
                        zone: true
                    }
                }
            }
        })

        await prisma.log_update_evaluate.create({
            data: {
                evaluateId: evaluate.id,
                category_questId: evaluate.category_questId,
                questId: evaluate.questId,
                sub_questId: evaluate.sub_questId,
                check: evaluate.check,
                hcode: evaluate.hcode,
                hname_th: evaluate.hospitals.hname_th,
                province: evaluate.hospitals.provname,
                zone: evaluate.hospitals.zone,
                userId: evaluate.userId
            }
        })

        res.json({ message: `แก้ไขคำตอบสำเร็จ!` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

exports.truncateTable = async (req, res) => {
    try {
        //Code
        await prisma.evaluate.deleteMany({ where: {} })
        res.status(200).json({
            message: 'Delete all success!'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}

//Save all pdf
exports.saveDocuments = async (req, res) => {
    try {
        //Code
        const data = req.body
        data.file_name = req.file.filename

        console.log(data)

        await prisma.documents.create({
            data: {
                category_questId: Number(data.category_questId),
                hcode: data.hcode,
                usersId: Number(data.usersId),
                file_name: data.file_name
            }
        })

        res.json({ message: `เพิ่มข้อมูลสำเร็จ!` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'ต้องเป็นไฟล์ PDF เท่านั้น!!' })
    }
}


// Save all pdf
exports.saveEvidenceAll = async (req, res) => {
    try {
        //Code
        const data = req.body
        data.file_name = req.file.filename

        console.log(data)

        await prisma.evidence_all.create({
            data: {
                category_questId: Number(data.category_questId),
                questId: Number(data.questId),
                sub_questId: Number(data.sub_questId),
                hcode: data.hcode,
                usersId: Number(data.usersId),
                file_name: data.file_name
            }
        })

        res.json({ message: `เพิ่มข้อมูลสำเร็จ!` })

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "ต้องเป็นไฟล์นามสกุล .png หรือ .jpg หรือ .pdf เท่านั้น!!" })
    }
}


exports.uploadFileById = async (req, res) => {
    try {
        //Code
        const data = req.body
        data.file_name = req.file.filename

        console.log(data)

        const check = await prisma.evaluate.findFirst({
            where: {
                id: Number(req.params.id),
                file_name: {
                    not: null
                }
            }
        })

        if (check) {
            return res.status(400).json({ message: 'มีการเพิ่มไฟล์ในหัวข้อนี้เรียบร้อยแล้ว!' })
        }

        const result = await prisma.evaluate.update({
            where: { id: Number(req.params.id) },
            data: {
                file_name: data.file_name
            }
        })

        // res.json({ message: `เพิ่มข้อมูลสำเร็จ!` })

        res.json({
            message: `เพิ่มข้อมูลสำเร็จ!`,
            data: result
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "ต้องเป็นไฟล์นามสกุล pdf เท่านั้น!!" })
    }
}


exports.removeFileById = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const find = await prisma.evaluate.findFirst({
            where: {
                id: Number(req.params.id)
            }
        })

        console.log(find)

        fs.unlinkSync(`file-uploads/${find.file_name}`)

        await prisma.evaluate.update({
            where: { id: Number(req.params.id) },
            data: {
                file_name: null
            }
        })

        res.json({ message: 'ลบไฟล์หลักฐานนี้สำเร็จ!!' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.uploadCyberImageFile = async (req, res) => {
    try {
        //Code
        const data = req.body
        data.cyber_image = req.file.filename

        console.log(data)

        await prisma.cyber_level.create({
            data: {
                cyber_level: data.cyber_level,
                cyber_image: data.cyber_image,
                usersId: Number(data.usersId),
                hcode: data.hcode
            }
        })


        res.json({ message: `เพิ่มข้อมูลระดับ Cyber security เรียบร้อย!` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error!" })
    }
}


exports.getCyberSecurityLevelData = async (req, res) => {
    try {
        //Code
        const { hcode } = req.query
        const result = await prisma.cyber_risk_level.findFirst({
            where: { hcode: hcode }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error!' })
    }
}


exports.getEvidenceFromEvaluate = async (req, res) => {
    try {
        // Code
        const { id, hcode } = req.query
        console.log(req.query)
        const result = await prisma.evaluate.findFirst({
            where: {
                AND: [
                    { id: Number(id) },
                    { hcode: hcode }
                ]
            }
        })
        // const result = await prisma.$queryRaw`SELECT t1.id AS evidenceId, t1.category_questId, t1.questId, t1.sub_questId,
        //                     t1.file_name, t1.hcode, t1.usersId, t1.createdAt, t1.updatedAt,	t2.id AS evaluateId
        //                 FROM Evidence_all AS t1 LEFT JOIN Evaluate AS t2
        //                 ON t1.category_questId = t2.category_questId AND t1.questId = t2.questId 
        //                 AND t1.sub_questId = t2.sub_questId AND t1.hcode = t2.hcode
        //                 WHERE t2.id = ${Number(id)} AND t1.hcode = ${hcode}`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}



exports.getDocumentsByEvaluateByHosp = async (req, res) => {
    try {
        //Code
        const { category_questId, hcode } = req.query

        const result = await prisma.documents.findFirst({
            where: {
                AND: [
                    { category_questId: Number(category_questId) },
                    { hcode: hcode }
                ]
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.ssjChangeStatusApprove = async (req, res) => {
    try {
        //Code
        const dataLogApprove = req.body.map((item) => ({
            evaluateId: item.evaluateId,
            ssj_approve: item.ssj_approve,
            usersId: item.usersId,
            hcode: item.hcode,
            province: item.province,
            zone: item.zone
        }))

        await prisma.evaluate.updateMany({
            where: {
                id: {
                    in: req.body.map((item => item.evaluateId))
                }
            },
            data: {
                ssj_approve: Boolean(req.body.map((item => item.ssj_approve)))
            }
        })

        // await prisma.log_ssj_approve.createMany({
        //     data: dataLogApprove
        // })

        res.json({
            message: `Aprove หัวข้อประเมินนี้เรียบร้อย!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.ssjApproveById = async (req, res) => {
    try {
        //Code
        const { id, ssj_approve } = req.body
        console.log(req.body)
        await prisma.evaluate.update({
            where: { id: Number(id) },
            data: {
                ssj_approve: ssj_approve,
                updatedAt: new Date()
            }
        })
        if (ssj_approve === true) {
            return res.json({
                message: `approve`
            })
        } else {
            return res.json({
                message: `unapprove`
            })
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.zoneChangeStatusApprove = async (req, res) => {
    try {
        //Code
        const dataLogApprove = req.body.map((item) => ({
            evaluateId: item.evaluateId,
            zone_approve: item.zone_approve,
            usersId: item.usersId,
            hcode: item.hcode,
            province: item.province,
            zone: item.zone
        }))

        await prisma.evaluate.updateMany({
            where: {
                id: {
                    in: req.body.map((item => item.evaluateId))
                }
            },
            data: {
                zone_approve: Boolean(req.body.map((item => item.zone_approve)))
            }
        })

        // await prisma.log_ssj_approve.createMany({
        //     data: dataLogApprove
        // })

        res.json({
            message: `Aprove หัวข้อประเมินนี้เรียบร้อย!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.changeStatusZoneApprove = async (req, res) => {
    try {
        //Code
        const { hcode, zone_approve } = req.body

        console.log(req.body)

        // await prisma.$queryRaw`UPDATE Evaluate SET zone_approve = ${zone_approve} WHERE hcode = ${hcode}`;

        await prisma.evaluate.updateMany({
            where: {
                hcode: hcode
            },
            data: {
                zone_approve: zone_approve
            }
        })

        // res.status(200).json({
        //     message: `อนุมัติรายการประเมินแล้ว!`
        // })

        if (zone_approve === true) {
            return res.status(200).json({
                message: `อนุมัติรายการประเมินแล้ว!`
            })
        }

        if (zone_approve === false) {
            return res.status(200).json({
                message: `ยกเลิกการอนุมัติรายการประเมินแล้ว!`
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.splitComma = async (req, res) => {
    try {
        //Code
        const { hcode } = req.query
        const result = await prisma.$queryRaw`SELECT ca.id AS category_questId, res.sub_quest_total_point, res.sub_quest_require_point
                FROM Category_quest ca
                LEFT JOIN (SELECT su.hcode, su.category_questId, SUM(su.sub_quest_total_point) sub_quest_total_point, SUM(su.sub_quest_require_point) sub_quest_require_point
                FROM (SELECT tb1.id AS evaluateId, tb1.category_questId, tb1.questId, tb1.sub_questId, tb1.hcode, tb1.userId, tb1.c_check, tb2.sub_quest_listname,tb2.sub_quest_total_point,
                    tb2.sub_quest_require_point, tb2.description, tb2.necessary
                FROM (SELECT t.id,t.category_questId,t.questId,t.sub_questId,t.hcode,t.userId,t.ssj_approve,SUBSTRING_INDEX(SUBSTRING_INDEX(t.check, ',', n.n), ',', -1) AS c_check
                FROM Evaluate t 
                CROSS JOIN (SELECT a.N + b.N * 10 + 1 n FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) a ,(SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) b ORDER BY n ) n 
                WHERE n.n <= 1 + (LENGTH(t.check) - LENGTH(REPLACE(t.check, ',', ''))) AND t.ssj_approve = TRUE ORDER BY id,c_check) tb1
                LEFT JOIN Sub_quest_list tb2 ON tb1.sub_questId = tb2.sub_questId AND tb1.c_check = tb2.choice WHERE tb1.hcode=${hcode}) su 
                GROUP BY su.hcode, su.category_questId ORDER BY su.hcode, su.category_questId ASC) res
                ON ca.id = res.category_questId ORDER BY category_questId ASC`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.getSumEvaluateByProv = async (req, res) => {
    try {
        //Code
        const { province } = req.query

        const result = await prisma.$queryRaw`SELECT tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,
            SUM(CASE WHEN tb1.id = 1 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat1,
            SUM(CASE WHEN tb1.id = 1 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat1,
			SUM(CASE WHEN tb1.id = 1 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat1,
            SUM(CASE WHEN tb1.id = 1 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat1,			 
            SUM(CASE WHEN tb1.id = 2 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat2,
            SUM(CASE WHEN tb1.id = 2 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat2,
			SUM(CASE WHEN tb1.id = 2 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat2,
            SUM(CASE WHEN tb1.id = 2 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat2,				 
            SUM(CASE WHEN tb1.id = 3 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat3,
            SUM(CASE WHEN tb1.id = 3 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat3,
			SUM(CASE WHEN tb1.id = 3 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat3,
            SUM(CASE WHEN tb1.id = 3 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat3,				
            SUM(CASE WHEN tb1.id = 4 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat4,
			SUM(CASE WHEN tb1.id = 4 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat4,
            SUM(CASE WHEN tb1.id = 4 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat4,			 
            tb1.cyber_level,tb1.cyber_levelname
  FROM (SELECT t1.id,t2.hcode,t2.hname_th,t2.provcode,t2.provname,t2.zone,t2.sub_quest_total_point,
               t2.sub_quest_require_point,t2.ssj_approve,t2.zone_approve,t2.cyber_level,t2.cyber_levelname FROM Category_quest AS t1 
  LEFT JOIN (SELECT a.category_questId,a.hcode,b.hname_th,b.provcode,	b.provname,b.zone,b.typename,
                    a.sub_quest_total_point,a.sub_quest_require_point,a.ssj_approve,a.zone_approve,a.cyber_level,a.cyber_levelname
                         FROM Sum_approve_evaluate AS a
             LEFT JOIN Hospitals AS b
             ON a.hcode = b.hcode COLLATE utf8mb4_unicode_ci) AS t2
             ON t1.id = t2.category_questId WHERE t2.provname = ${province} 
             AND t2.typename IN ('โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน')) AS tb1
   GROUP BY tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,tb1.cyber_level,tb1.cyber_levelname`

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.getSumEvaluateByZone = async (req, res) => {
    try {
        //Code
        const { zone } = req.query

        const result = await prisma.$queryRaw`SELECT tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,
            SUM(CASE WHEN tb1.id = 1 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat1,
            SUM(CASE WHEN tb1.id = 1 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat1,
			SUM(CASE WHEN tb1.id = 1 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat1,
            SUM(CASE WHEN tb1.id = 1 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat1,			 
            SUM(CASE WHEN tb1.id = 2 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat2,
            SUM(CASE WHEN tb1.id = 2 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat2,
			SUM(CASE WHEN tb1.id = 2 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat2,
            SUM(CASE WHEN tb1.id = 2 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat2,				 
            SUM(CASE WHEN tb1.id = 3 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat3,
            SUM(CASE WHEN tb1.id = 3 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat3,
			SUM(CASE WHEN tb1.id = 3 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat3,
            SUM(CASE WHEN tb1.id = 3 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat3,				
            SUM(CASE WHEN tb1.id = 4 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat4,
			SUM(CASE WHEN tb1.id = 4 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat4,
            SUM(CASE WHEN tb1.id = 4 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat4,			 
            tb1.cyber_level,tb1.cyber_levelname
        FROM (SELECT t1.id,t2.hcode,t2.hname_th,t2.provcode,t2.provname,t2.zone,t2.sub_quest_total_point,
                    t2.sub_quest_require_point,t2.ssj_approve,t2.zone_approve,t2.cyber_level,t2.cyber_levelname FROM Category_quest AS t1 
        LEFT JOIN (SELECT a.category_questId,a.hcode,b.hname_th,b.provcode,	b.provname,b.zone,b.typename,
                            a.sub_quest_total_point,a.sub_quest_require_point,a.ssj_approve,a.zone_approve,a.cyber_level,a.cyber_levelname
                                FROM Sum_approve_evaluate AS a
                    LEFT JOIN Hospitals AS b
                    ON a.hcode = b.hcode COLLATE utf8mb4_unicode_ci) AS t2
                    ON t1.id = t2.category_questId WHERE t2.zone = ${zone} 
                    AND t2.typename IN ('โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน')) AS tb1
        GROUP BY tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,tb1.cyber_level,tb1.cyber_levelname`

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.getSumEvaluateForAll = async (req, res) => {
    try {
        //Code
        const result = await prisma.$queryRaw`SELECT tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,
                            SUM(CASE WHEN tb1.id = 1 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat1,
                            SUM(CASE WHEN tb1.id = 1 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat1,
			                SUM(CASE WHEN tb1.id = 1 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat1,
                            SUM(CASE WHEN tb1.id = 1 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat1,			 
                            SUM(CASE WHEN tb1.id = 2 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat2,
                            SUM(CASE WHEN tb1.id = 2 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat2,
			                SUM(CASE WHEN tb1.id = 2 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat2,
                            SUM(CASE WHEN tb1.id = 2 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat2,				 
                            SUM(CASE WHEN tb1.id = 3 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat3,
                            SUM(CASE WHEN tb1.id = 3 THEN tb1.sub_quest_require_point ELSE 0 END) AS point_require_cat3,
			                SUM(CASE WHEN tb1.id = 3 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat3,
                            SUM(CASE WHEN tb1.id = 3 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat3,				
                            SUM(CASE WHEN tb1.id = 4 THEN tb1.sub_quest_total_point ELSE 0 END) AS point_total_cat4,
			                SUM(CASE WHEN tb1.id = 4 && tb1.ssj_approve = 1 THEN tb1.ssj_approve ELSE 0 END) AS ssjapp_cat4,
                            SUM(CASE WHEN tb1.id = 4 && tb1.zone_approve = 1 THEN tb1.zone_approve ELSE 0 END) AS zoneapp_cat4,
                            tb1.cyber_level,tb1.cyber_levelname
                        FROM (SELECT t1.id,t2.hcode,t2.hname_th,t2.provcode,t2.provname,t2.zone,t2.sub_quest_total_point,
                        t2.sub_quest_require_point,t2.ssj_approve,t2.zone_approve,t2.cyber_level,t2.cyber_levelname FROM Category_quest AS t1 
                        LEFT JOIN (SELECT a.category_questId,a.hcode,b.hname_th,b.provcode,	b.provname,b.zone,b.typename,
                        a.sub_quest_total_point,a.sub_quest_require_point,a.ssj_approve,a.zone_approve,a.cyber_level,a.cyber_levelname
                        FROM Sum_approve_evaluate AS a
                        LEFT JOIN Hospitals AS b
                        ON a.hcode = b.hcode COLLATE utf8mb4_unicode_ci) AS t2
                        ON t1.id = t2.category_questId WHERE t2.typename IN ('โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน')) AS tb1
                        GROUP BY tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,tb1.cyber_level,tb1.cyber_levelname`

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.getSumEvaluateForAll2 = async (req, res) => {
    try {
        //Code
        const result = await prisma.$queryRaw`SELECT a.zone,a.provcode,a.provname,a.hcode,a.hname_th,a.typename,
            b.point_total_cat1,b.point_require_cat1,b.point_total_cat2,b.point_require_cat2,
            b.point_total_cat3,b.point_require_cat3,b.point_total_cat4, cyber_level,cyber_levelname
        FROM Hospitals AS a 
        LEFT JOIN (SELECT 
                    hcode,
                    SUM(CASE WHEN category_questId = 1 THEN sub_quest_total_point ELSE 0 END) AS point_total_cat1,
                    SUM(CASE WHEN category_questId = 1 THEN sub_quest_require_point ELSE 0 END) AS point_require_cat1,
                    SUM(CASE WHEN category_questId = 2 THEN sub_quest_total_point ELSE 0 END) AS point_total_cat2,
                    SUM(CASE WHEN category_questId = 2 THEN sub_quest_require_point ELSE 0 END) AS point_require_cat2,
                    SUM(CASE WHEN category_questId = 3 THEN sub_quest_total_point ELSE 0 END) AS point_total_cat3,
                    SUM(CASE WHEN category_questId = 3 THEN sub_quest_require_point ELSE 0 END) AS point_require_cat3,
                    SUM(CASE WHEN category_questId = 4 THEN sub_quest_total_point ELSE 0 END) AS point_total_cat4
                FROM Sum_approve_evaluate
                GROUP BY hcode) AS b
        ON a.hcode = b.hcode COLLATE utf8mb4_unicode_ci
        LEFT JOIN Cyber_risk_level AS c 
        ON a.hcode = c.hcode COLLATE utf8mb4_unicode_ci
        WHERE a.typename IN ('โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน')
        ORDER BY CAST(a.zone AS UNSIGNED), a.provcode ASC`

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.checkSsjNotApprove = async (req, res) => {
    try {
        const { hospcode, category_questId } = req.query

        const result = await prisma.evaluate.findMany({
            where: {
                AND: [
                    { hcode: hospcode },
                    { category_questId: Number(category_questId) },
                    { ssj_approve: false }
                ]
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.checkZoneNotApprove = async (req, res) => {
    try {
        const { province, hospcode, category_questId } = req.query

        const result = await prisma.evaluate.findMany({
            where: {
                AND: [
                    { hcode: hospcode },
                    { category_questId: Number(category_questId) },
                    { zone_approve: false },
                    {
                        hospitals: {
                            is: {
                                provname: province
                            }
                        }
                    }
                ]
            }
        })

        res.json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

//SSJ UNAPPROVE
exports.ssjUnApprove = async (req, res) => {
    try {
        //Code
        const ssj_approve = req.body.map((item) => ({
            ssj_approve: item.ssj_approve
        }))

        console.log('Bol: ', ssj_approve)

        console

        await prisma.evaluate.updateMany({
            where: {
                id: {
                    in: req.body.map((item => item.evaluateId))
                }
            },
            data: {
                ssj_approve: false
            }



        })

        res.json({
            message: `ยกเลิกการอนุมัติเรียบร้อยแล้ว!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

//ZONE UNAPPROVE
exports.zoneUnApprove = async (req, res) => {
    try {
        //Code
        await prisma.evaluate.updateMany({
            where: {
                id: {
                    in: req.body.map((item => item.evaluateId))
                }
            },
            data: {
                zone_approve: false
            }
        })

        res.json({
            message: `ยกเลิกการอนุมัติเรียบร้อยแล้ว!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.selectApproveEvaluate = async (req, res) => {
    try {
        //Code
        const { zone } = req.query

        const result = await prisma.$queryRaw`SELECT t1.id,t2.hcode,t2.hname_th,t2.provcode,t2.provname,t2.zone,t2.sub_quest_total_point,
                        t2.sub_quest_require_point,t2.ssj_approve,t2.zone_approve,t2.cyber_level,t2.cyber_levelname FROM Category_quest AS t1 
                        LEFT JOIN (SELECT a.category_questId,a.hcode,b.hname_th,b.provcode,	b.provname,b.zone,b.typename,
                        a.sub_quest_total_point,a.sub_quest_require_point,a.ssj_approve,a.zone_approve,a.cyber_level,a.cyber_levelname
                        FROM Sum_approve_evaluate AS a
                        LEFT JOIN Hospitals AS b
                        ON a.hcode = b.hcode COLLATE utf8mb4_unicode_ci) AS t2
                        ON t1.id = t2.category_questId WHERE t2.typename IN ('โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน') AND t2.zone = ${zone}`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.getCommentEvaluate = async (req, res) => {
    try {
        //Code
        const result = await prisma.comment.findMany()

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.getCommentEvaluateById = async (req, res) => {
    try {
        //Code
        const { id } = req.params;
        const result = await prisma.comment.findFirst({
            where: {
                id: parseInt(id)
            }
        });

        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.commentEvaluate = async (req, res) => {
    try {
        //Code
        const { evaluateId, comment_text, userId } = req.body
        console.log(req.body)

        const check = await prisma.comment.findFirst({
            where:{
                evaluateId: Number(evaluateId)
            }
        })

        if (check) {
            return res.json({message: 'มีความคิดเห็นในข้อนี้แล้ว'})
        }

        await prisma.comment.create({
            data: {
                evaluateId: Number(evaluateId),
                comment_text: comment_text,
                userId: Number(userId),
                createdAt: new Date()
            }
        })
        res.status(200).json({
            message: 'บันทึกข้อคิดเห็นเรียบร้อย'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.updateCommentEvaluate = async (req, res) => {
    try {
        //Code
        const { id, comment_text, userId } = req.body

        const result = await prisma.comment.update({
            where: {
                id: parseInt(id)
            },
            data: {
                comment_text: comment_text,
                userId: parseInt(userId),
                updatedAt: new Date()
            }
        })

        res.status(200).json({ message: 'แก้ไขความเห็นเรียบร้อย!!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.removeComment = async (req, res) =>{
    try {
        //Code
        const {id} = req.params

        const result = await prisma.comment.delete({
            where:{
                id: Number(id)
            }
        })

        res.status(200).json({ message: 'ลบความเห็นเรียบร้อย!!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.checkApproveAll = async (req, res) => {
    try {
        //Code
        const result = await prisma.$queryRaw`SELECT t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th,
                                    COUNT(CASE WHEN t1.category_questId = 1 THEN 1 END) AS c_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat1,
                                    COUNT(CASE WHEN t1.category_questId = 2 THEN 1 END) AS c_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat2,
                                    COUNT(CASE WHEN t1.category_questId = 3 THEN 1 END) AS c_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat3,
                                    COUNT(CASE WHEN t1.category_questId = 4 THEN 1 END) AS c_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat4
                                    FROM Evaluate AS t1 
                                    INNER JOIN Hospitals AS t2
                                    ON t1.hcode = t2.hcode COLLATE utf8mb4_unicode_ci
                                    WHERE t2.typename IN ('โรงพยาบาลศูนย์','โรงพยาบาลทั่วไป','โรงพยาบาลชุมชน')
                                    GROUP BY t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th
                                    ORDER BY CAST(t2.zone AS UNSIGNED), t2.provcode ASC`

        const total_result = result.map((item) => ({
            zone: item.zone,
            provcode: item.provcode,
            provname: item.provname,
            hcode: item.hcode,
            hname_th: item.hname_th,
            c_cat1: Number(item.c_cat1),
            ssj_approve_cat1: Number(item.ssj_approve_cat1),
            ssj_unapprove_cat1: Number(item.ssj_unapprove_cat1),
            zone_approve_cat1: Number(item.zone_approve_cat1),
            zone_unapprove_cat1: Number(item.zone_unapprove_cat1),
            c_cat2: Number(item.c_cat2),
            ssj_approve_cat2: Number(item.ssj_approve_cat2),
            ssj_unapprove_cat2: Number(item.ssj_unapprove_cat2),
            zone_approve_cat2: Number(item.zone_approve_cat2),
            zone_unapprove_cat2: Number(item.zone_unapprove_cat2),
            c_cat3: Number(item.c_cat3),
            ssj_approve_cat3: Number(item.ssj_approve_cat3),
            ssj_unapprove_cat3: Number(item.ssj_unapprove_cat3),
            zone_approve_cat3: Number(item.zone_approve_cat3),
            zone_unapprove_cat3: Number(item.zone_unapprove_cat3),
            c_cat4: Number(item.c_cat4),
            ssj_approve_cat4: Number(item.ssj_approve_cat4),
            ssj_unapprove_cat4: Number(item.ssj_unapprove_cat4),
            zone_approve_cat4: Number(item.zone_approve_cat4),
            zone_unapprove_cat4: Number(item.zone_unapprove_cat4)
        }))

        res.status(200).json(total_result)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.checkApproveZone = async (req, res) => {
    try {
        //Code
        const { zone } = req.query
        const result = await prisma.$queryRaw`SELECT t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th,
                                    COUNT(CASE WHEN t1.category_questId = 1 THEN 1 END) AS c_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat1,
                                    COUNT(CASE WHEN (t1.category_questId = 1 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat1,
                                    COUNT(CASE WHEN t1.category_questId = 2 THEN 1 END) AS c_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat2,
                                    COUNT(CASE WHEN (t1.category_questId = 2 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat2,
                                    COUNT(CASE WHEN t1.category_questId = 3 THEN 1 END) AS c_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat3,
                                    COUNT(CASE WHEN (t1.category_questId = 3 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat3,
                                    COUNT(CASE WHEN t1.category_questId = 4 THEN 1 END) AS c_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.ssj_approve = TRUE) THEN 1 END) AS ssj_approve_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.ssj_approve = FALSE) THEN 1 END) AS ssj_unapprove_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.zone_approve = TRUE) THEN 1 END) AS zone_approve_cat4,
                                    COUNT(CASE WHEN (t1.category_questId = 4 && t1.zone_approve = FALSE) THEN 1 END) AS zone_unapprove_cat4
                                    FROM Evaluate AS t1 
                                    INNER JOIN Hospitals AS t2
                                    ON t1.hcode = t2.hcode COLLATE utf8mb4_unicode_ci
                                    WHERE t2.typename IN ('โรงพยาบาลศูนย์','โรงพยาบาลทั่วไป','โรงพยาบาลชุมชน') AND t2.zone = ${zone} -- ,'หน่วยงานทดสอบระบบ'
                                    GROUP BY t2.zone,t2.provcode,t2.provname,t1.hcode,t2.hname_th
                                    ORDER BY CAST(t2.zone AS UNSIGNED), t2.provcode ASC`

        const total_result = result.map((item) => ({
            zone: item.zone,
            provcode: item.provcode,
            provname: item.provname,
            hcode: item.hcode,
            hname_th: item.hname_th,
            c_cat1: Number(item.c_cat1),
            ssj_approve_cat1: Number(item.ssj_approve_cat1),
            ssj_unapprove_cat1: Number(item.ssj_unapprove_cat1),
            zone_approve_cat1: Number(item.zone_approve_cat1),
            zone_unapprove_cat1: Number(item.zone_unapprove_cat1),
            c_cat2: Number(item.c_cat2),
            ssj_approve_cat2: Number(item.ssj_approve_cat2),
            ssj_unapprove_cat2: Number(item.ssj_unapprove_cat2),
            zone_approve_cat2: Number(item.zone_approve_cat2),
            zone_unapprove_cat2: Number(item.zone_unapprove_cat2),
            c_cat3: Number(item.c_cat3),
            ssj_approve_cat3: Number(item.ssj_approve_cat3),
            ssj_unapprove_cat3: Number(item.ssj_unapprove_cat3),
            zone_approve_cat3: Number(item.zone_approve_cat3),
            zone_unapprove_cat3: Number(item.zone_unapprove_cat3),
            c_cat4: Number(item.c_cat4),
            ssj_approve_cat4: Number(item.ssj_approve_cat4),
            ssj_unapprove_cat4: Number(item.ssj_unapprove_cat4),
            zone_approve_cat4: Number(item.zone_approve_cat4),
            zone_unapprove_cat4: Number(item.zone_unapprove_cat4)
        }))

        res.status(200).json(total_result)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.splitCommaForCheckApproveByHosp = async (req, res) => {
    try {
        //Code

        const {hcode} = req.query
        const result = await prisma.$queryRaw`SELECT 
            tb3.zone,tb3.provcode,tb3.provname,tb1.hcode,tb3.hname_th,tb1.id,tb1.category_questId,
            tb1.questId,tb1.sub_questId,tb1.userId,tb1.c_check,tb1.ssj_approve,tb1.zone_approve,
            tb2.sub_quest_total_point,tb2.sub_quest_require_point,tb2.necessary
            FROM (SELECT t.id,t.category_questId,t.questId,t.sub_questId,t.hcode,t.userId,
                         SUBSTRING_INDEX(SUBSTRING_INDEX(t.check, ',', n.n), ',', -1) AS c_check, t.ssj_approve, t.zone_approve
                 FROM Evaluate t 
                 CROSS JOIN (SELECT a.N + b.N * 10 + 1 n FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) a ,(SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) b ORDER BY n ) n 
                 WHERE n.n <= 1 + (LENGTH(t.check) - LENGTH(REPLACE(t.check, ',', ''))) ORDER BY id,c_check) tb1
            INNER JOIN Sub_quest_list AS tb2
            ON tb1.c_check = tb2.choice AND tb1.sub_questId = tb2.sub_questId
            INNER JOIN Hospitals AS tb3
            ON tb1.hcode = tb3.hcode COLLATE utf8mb4_unicode_ci
            WHERE tb3.typename IN ('โรงพยาบาลศูนย์','โรงพยาบาลทั่วไป','โรงพยาบาลชุมชน') AND tb1.hcode = ${hcode} -- ,'หน่วยงานทดสอบระบบ'
            ORDER BY CAST(tb3.zone AS UNSIGNED), tb3.provcode ASC`

        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}