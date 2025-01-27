const prisma = require('../Config/Prisma')
const jwt = require('jsonwebtoken')


exports.registerByProviderID = async (req, res) => {
    try {
        const {
            email,
            // title_th,
            firstname_th,
            lastname_th,
            hcode,
            hname_th,
            position_id,
            position,
            // sub_district,
            district,
            province,
            zone,
            objective,
            level
        } = req.body

        const user = await prisma.users.findFirst({
            where: {
                email: email,
                hcode: hcode,
                firstname_th: firstname_th,
                lastname_th: lastname_th,
                objective: objective,
                level: Number(level)
            }
        })
        if (user) {
            return res.status(400).json({ message: 'มีข้อมูลของท่านในประเภทผู้ใช้นี้แล้วโปรด Login ด้วย ProviderID!' })
        }

        await prisma.users.create({
            data: {
                email: email,
                // title_th: title_th,
                firstname_th: firstname_th,
                lastname_th: lastname_th,
                hcode: hcode,
                hname_th: hname_th,
                position_id: position_id,
                position: position,
                // sub_district: sub_district,
                district: district,
                province: province,
                zone: zone,
                objective: objective,
                level: Number(level)
            }
        })

        res.json({ message: 'บันทึกข้อมูลสำเร็จ กรูณา Login เข้าใช้งาน!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error!'
        })
    }
}

exports.loginByProviderID = async (req, res) => {
    try {
        //Code
        const { email, firstname_th, lastname_th, hcode, level } = req.body

        //Step 1 Check user
        const user = await prisma.users.findFirst({
            where: {
                AND: [
                    { email: email },
                    { hcode: hcode },
                    { firstname_th: firstname_th },
                    { lastname_th: lastname_th },
                    { level: Number(level) }
                ]
            }
        })
        // console.log('Body: ', req.body)
        // console.log('User: ', user)
        if (user) {
            //Step 2 Check approve
            if (!user || !user.enabled) {
                return res.status(400).json({
                    message: "Account ของคุณยังไม่ได้รับการอนุมัติ!"
                })
            }

            //Create payload
            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    // title_th: user.title_th,
                    firstname_th: user.firstname_th,
                    lastname_th: user.lastname_th,
                    hcode: user.hcode,
                    hname_th: user.hname_th,
                    position_id: user.position_id,
                    position: user.position,
                    role: user.role,
                    objective: user.objective,
                    // sub_district: user.sub_district,
                    district: user.district,
                    province: user.province,
                    zone: user.zone
                }
            }

            //Step 4 Generate token
            jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: 'Server Error' })
                }
                res.json({ payload, token })
            })
        } else {
            res.status(400).json({ message: 'ไม่พบ Account กรุณาลงทะเบียนเข้าใช้งาน!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error!'
        })
    }
}


exports.currentUser = async (req, res) => {
    try {
        //Code
        const { email, firstname_th, lastname_th, hcode, } = req.user
        const user = await prisma.users.findFirst({
            where: {
                email: email,
                firstname_th: firstname_th,
                lastname_th: lastname_th,
                hcode: hcode
            },
            select: {
                email: true,
                // title_th: true,
                firstname_th: true,
                lastname_th: true,
                hcode: true,
                hname_th: true,
                position_id: true,
                position: true,
                role: true
            }
        })
        res.json({ user })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error!'
        })
    }
}