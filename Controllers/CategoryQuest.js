const prisma = require('../Config/Prisma')
const moment = require('moment')


exports.createCategory = async (req, res)=>{
    try {
        //Code
        const {
            category_name_th,
            category_name_eng,
            fiscal_year
        } = req.body

        const category = await prisma.category_quest.findFirst({
            where:{
                category_name_th: category_name_th,
                category_name_eng: category_name_eng,
                fiscal_year: fiscal_year
            }
        })

        if(category){
            return res.status(400).json({
                message: `มี${category.category_name_th} ปีงบประมาณ ${category.fiscal_year} ในระบบแล้ว`
            })
        }

        await prisma.category_quest.create({
            data:{
                category_name_th: category_name_th, 
                category_name_eng: category_name_eng,
                fiscal_year: fiscal_year,
            }
        })
        
        res.json({message: "เพิ่มข้อมูลเรียบสำเร็จ!"})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

exports.getListCategory = async(req,res)=>{
    try {
        //Code
        const category = await prisma.category_quest.findMany()
        res.json(category)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Serveer error!"
        })
    }
}

exports.getCategoryById = async(req,res)=>{
    try {
        //Code
        const {id} = req.params
        const category = await prisma.category_quest.findFirst({
            where:{id: Number(id)}
        })

        res.json(category)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Serveer error!"
        })
    }
}

exports.updateCategory = async(req,res)=>{
    try {
        //Code
        const {
            id, 
            category_name_th, 
            category_name_eng,
            fiscal_year
        } = req.body

        const category = await prisma.category_quest.update({
            where:{id: Number(id)},
            data:{
                category_name_th: category_name_th,
                category_name_eng: category_name_eng,
                fiscal_year: fiscal_year,
                updatedAt: new Date()
            }
        })
        
        res.json({message: "แก้ไขข้อมูลสำเร็จ!"})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!"
        })
    }
}

exports.removeCategory = async(req,res)=>{
    try {
        //Code
        const {id} = req.params
        const category = await prisma.category_quest.delete({
            where:{id: Number(id)}
        })
        res.json({message: "ลบข้อมูลสำเร็จ!"})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Serveer error!"
        })
    }
}