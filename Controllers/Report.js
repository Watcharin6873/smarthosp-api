const prisma = require('../Config/Prisma')

exports.report_evaluate_all = async (req, res) => {
    try {
        //Code
        // const result = await prisma.$queryRaw`SELECT zone,provcode,provname,hcode,hname_th,typename,point_total_cat1,point_require_cat1,	
        //                 point_total_cat2,point_require_cat2,point_total_cat3,point_require_cat3,point_total_cat4,cyber_level, cyber_levelname
        //                 FROM Report_evaluate_all`

        const result = await prisma.$queryRaw`SELECT tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,tb1.typename,
                        SUM(CASE WHEN tb1.category_questId = 1 THEN tb1.sub_quest_total_point END) AS point_total_cat1,
                        SUM(CASE WHEN tb1.category_questId = 1 THEN tb1.sub_quest_require_point END) AS point_require_cat1,	
                        SUM(CASE WHEN tb1.category_questId = 2 THEN tb1.sub_quest_total_point END) AS point_total_cat2,
                        SUM(CASE WHEN tb1.category_questId = 2 THEN tb1.sub_quest_require_point END) AS point_require_cat2,	
                        SUM(CASE WHEN tb1.category_questId = 3 THEN tb1.sub_quest_total_point END) AS point_total_cat3,
                        SUM(CASE WHEN tb1.category_questId = 3 THEN tb1.sub_quest_require_point END) AS point_require_cat3,	
                        SUM(CASE WHEN tb1.category_questId = 4 THEN tb1.sub_quest_total_point END) AS point_total_cat4,
                            tb1.cyber_level, tb1.cyber_levelname
                        FROM (SELECT a.zone,a.provcode,a.provname,a.hcode,a.hname_th,a.typename,
                                    c.category_questId,c.sub_quest_total_point,c.sub_quest_require_point,
                                    b.cyber_level, b.cyber_levelname
                        FROM Hospitals AS a 
                        LEFT JOIN Cyber_risk_level AS b 
                        ON a.hcode = b.hcode
                        LEFT JOIN Sum_approve_evaluate AS c 
                        ON a.hcode COLLATE utf8mb4_unicode_ci = c.hcode
                        WHERE a.typename IN ('โรงพยาบาลศูนย์', 'โรงพยาบาลทั่วไป', 'โรงพยาบาลชุมชน')) tb1
                        GROUP BY tb1.zone,tb1.provcode,tb1.provname,tb1.hcode,tb1.hname_th,tb1.typename,tb1.cyber_level, tb1.cyber_levelname
                        ORDER BY CAST(tb1.zone AS UNSIGNED), tb1.provcode ASC`;

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}


exports.reportForPivot = async (req, res) =>{
    try {
        //Code
        const result = await prisma.$queryRaw`SELECT zone,provcode,provname,hcode,hname_th,sub_quest_name,c_check FROM For_report_all`

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' })
    }
}