const prisma = require('../Config/Prisma')


exports.getListUsers = async (req, res) => {
    try {
        //Code
        const user = await prisma.users.findMany({
            orderBy: { createdAt: 'desc' }
        })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.getListUsersZoneApprove = async (req, res) => {
    try {
        //Code
        const zone_aprove = 'zone_aprove'
        const user = await prisma.users.findMany({
            where:{objective: "zone_approve"},
            orderBy: { createdAt: 'desc' }
        })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.getListUsersByProv = async (req, res) => {
    try {
        //Code
        const { province } = req.query
        const user = await prisma.users.findMany({
            where: {
                role: { not: "admin" },
                objective: { in: ["responder"] },
                province: province
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.getListUsersByZone = async (req, res) => {
    try {
        //Code
        const { zone } = req.query
        const user = await prisma.users.findMany({
            where: {
                role: { not: "admin" },
                objective: { in: ["prov_approve"] },
                zone: zone
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.getListUserById = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const user = await prisma.users.findFirst({
            where: {
                id: Number(id)
            }
        })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.changeStatus = async (req, res) => {
    try {
        //Code
        const { id, enabled } = req.body

        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: {
                enabled: enabled,
                updatedAt: new Date()
            }
        })

        res.json({
            message: `Update Account ของคุณ${user.firstname_th} สำเร็จ!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.changeRole = async (req, res) => {
    try {
        //Code
        const { id, role } = req.body

        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: {
                role: role,
                updatedAt: new Date()
            }
        })

        res.json({
            message: `เปลี่ยนสิทธิเข้าใช้งานของคุณ${user.firstname_th} สำเร็จ!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.changeLevel = async (req, res) => {
    try {
        //Code
        const { id, level } = req.body

        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: {
                level: level,
                updatedAt: new Date()
            }
        })

        res.json({
            message: `เปลี่ยนระดับสิทธิเข้าใช้งานของคุณ${user.firstname_th} สำเร็จ!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}


exports.changeObjective = async (req, res) => {
    try {
        //Code
        const { id, objective } = req.body

        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: {
                objective: objective,
                updatedAt: new Date()
            }
        })

        res.json({
            message: `เปลี่ยนประเภทผู้ใช้งานของคุณ${user.firstname_th} สำเร็จ!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.removeUser = async (req, res) => {
    try {
        //Code
        const { id } = req.params

        const user = await prisma.users.delete({
            where: { id: Number(id) }
        })

        res.json({
            message: `ลบบัญชีของคุณ${user.firstname_th} สำเร็จ!`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sever error!"
        })
    }
}

exports.approveUserOnProv = async(req, res) =>{
    try {
       //Code
       const {province} = req.params
       const result = await prisma.users.findMany({
        where:{
            AND:[
                {province: province},
                {enabled: true},
                {objective: 'responder'},
                {level: 4}
            ]
        }
       }) 

       res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error!"})
    }
}


exports.notApproveUserOnProv = async(req, res) =>{
    try {
       //Code
       const {province} = req.params
       const result = await prisma.users.findMany({
        where:{
            AND:[
                {province: province},
                {objective: 'responder'},
                {enabled: false},
                {level: 4}
            ]
        }
       }) 

       res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error!"})
    }
}


exports.approveUserOnZone = async(req, res) =>{
    try {
       //Code
       const {zone} = req.params
       const result = await prisma.users.findMany({
        where:{
            AND:[
                {zone: zone},
                {enabled: true},
                {level: 3}
            ]
        }
       }) 

       res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error!"})
    }
}


exports.notApproveUserOnZone = async(req, res) =>{
    try {
       //Code
       const {zone} = req.params
       const result = await prisma.users.findMany({
        where:{
            AND:[
                {zone: zone},
                {enabled: false},
                {level: 3}
            ]
        }
       }) 

       res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error!"})
    }
}