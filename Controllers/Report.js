const prisma = require('../Config/Prisma')

exports.report_evaluate_all = async (req, res) => {
    try {
        //Code
        const result = await prisma.$queryRaw`SELECT zone,provcode,provname,hcode,hname_th,typename,point_total_cat1,point_require_cat1,	
                        point_total_cat2,point_require_cat2,point_total_cat3,point_require_cat3,point_total_cat4,cyber_level, cyber_levelname
                        FROM Report_evaluate_all`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}