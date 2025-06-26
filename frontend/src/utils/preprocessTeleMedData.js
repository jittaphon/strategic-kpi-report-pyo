// utils/preprocessTeleMedData.js

export function preprocessTeleMedData(baseData, apiTotals) {
    // สร้าง Map เพื่อให้เข้าถึงข้อมูล baseData ได้ง่ายและรวดเร็วด้วย HOSPCODE_HOSNAME
    const baseDataMap = new Map();
    baseData.forEach(item => {
        const hospcodeHosname = `${item.HOSPCODE || ''} ${item.hosname || ''}`.trim();
        baseDataMap.set(hospcodeHosname, item);
    });

    const processedData = apiTotals.map((apiItem) => { // <-- เปลี่ยนมาวนลูปจาก apiTotals เป็นหลัก
        const hospcodeHosname = apiItem.HOSPCODE_HOSNAME;
        const correctTotalFromApi = parseInt(apiItem.Total) || 0; // Total นี้มาจาก API กระทรวง

        // ดึงข้อมูลที่ตรงกันจาก baseDataMap
        const baseItem = baseDataMap.get(hospcodeHosname);

        // ดึงค่าบริการรายเดือนจาก baseData ถ้ามี ถ้าไม่มี ให้เป็น 0
        const total_october = baseItem ? (parseInt(baseItem.total_october) || 0) : 0;
        const total_november = baseItem ? (parseInt(baseItem.total_november) || 0) : 0;
        const total_december = baseItem ? (parseInt(baseItem.total_december) || 0) : 0;
        const total_january = baseItem ? (parseInt(baseItem.total_january) || 0) : 0;
        const total_february = baseItem ? (parseInt(baseItem.total_february) || 0) : 0;
        const total_april = baseItem ? (parseInt(baseItem.total_april) || 0) : 0;
        const total_may = baseItem ? (parseInt(baseItem.total_may) || 0) : 0;
        const total_june = baseItem ? (parseInt(baseItem.total_june) || 0) : 0;
        const total_july = baseItem ? (parseInt(baseItem.july) || 0) : 0; // ตรวจสอบว่าใน baseData ใช้ 'july' หรือ 'total_july'
        const total_august = baseItem ? (parseInt(baseItem.total_august) || 0) : 0;
        const total_september = baseItem ? (parseInt(baseItem.total_september) || 0) : 0;


        // คำนวณผลรวมของเดือนที่มีข้อมูลจริงจาก baseData (ต.ค. - ก.พ.)
        const sumOfKnownPreviousMonths =
            total_october +
            total_november +
            total_december +
            total_january +
            total_february;

        // คำนวณค่า total_march (ซึ่งหมายถึงช่วง มี.ค. - มิ.ย.) ที่ถูกต้อง
        // โดยใช้ Total จาก API กระทรวง ลบด้วยผลรวมของเดือนก่อนหน้า
        const calculated_total_march = correctTotalFromApi - sumOfKnownPreviousMonths;

        // ป้องกันไม่ให้ค่าติดลบ หากข้อมูลมีปัญหา
        const final_total_march = Math.max(0, calculated_total_march);

        return {
            HOSPCODE_HOSNAME: hospcodeHosname,
            Total: correctTotalFromApi, // ใช้ Total จาก API กระทรวง
            total_october: total_october,
            total_november: total_november,
            total_december: total_december,
            total_january: total_january,
            total_february: total_february,
            total_march: final_total_march, // ยอดของ มี.ค. - มิ.ย. ที่คำนวณใหม่
            total_april: total_april,
            total_may: total_may,
            total_june: total_june,
            total_july: total_july,
            total_august: total_august,
            total_september: total_september,
        };
    });

    // เรียงลำดับข้อมูลตาม Total ที่ถูกต้อง (จาก API กระทรวง)
    const sortedData = processedData.slice().sort((a, b) => b.Total - a.Total);

    // ยังคง Filter รายการที่ไม่ต้องการออกไปตาม removeList เดิมของคุณ
    const removeList = [
        "10414 สถานบริการสาธารณสุขชุมชนบ้านขุนกำลัง",
        "06573 โรงพยาบาลส่งเสริมสุขภาพตำบลจุน",
        "06576 โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านร่องย้าง",
        "06641 โรงพยาบาลส่งเสริมสุขภาพตำบลเชียงแรง",
        "06561 สถานีอนามัยเฉลิมพระเกียรติ 60 พรรษา นวมินทราชินี แม่ปืม จ.พะเยา",
    ];

    const filteredData = sortedData.filter(
        (item) =>
            !removeList.some((removeItem) =>
                item.HOSPCODE_HOSNAME.trim().includes(removeItem.trim())
            )
    );

    const finalData = filteredData.sort((a, b) => b.Total - a.Total);

    // กำหนดคอลัมน์ที่จะแสดงในตาราง
    const numericKeys = [
        "Total",
        "total_october",
        "total_november",
        "total_december",
        "total_january",
        "total_february",
        "total_march",
        // ถ้าคุณต้องการแสดงเดือนอื่น ๆ ที่เป็น 0 ให้เพิ่มตรงนี้
        // "total_april",
        // "total_may",
        // "total_june",
        // "total_july",
        // "total_august",
        // "total_september",
    ];

    const columnHeaderMap = {
        Total: "จำนวนให้บริการ (ครั้ง)",
        total_october: "ต.ค. 2567",
        total_november: "พ.ย. 2567",
        total_december: "ธ.ค. 2567",
        total_january: "ม.ค. 2568",
        total_february: "ก.พ. 2568",
        total_march: "มี.ค. - มิ.ย. 2568",
        total_april: "เม.ย. 2568", // เพิ่ม header ถ้าต้องการแสดง
        total_may: "พ.ค. 2568",
        total_june: "มิ.ย. 2568",
        total_july: "ก.ค. 2568",
        total_august: "ส.ค. 2568",
        total_september: "ก.ย. 2568",
    };

    const columns = [
        {
            header: "โรงพยาบาล/สถานพยาบาล",
            accessorKey: "HOSPCODE_HOSNAME",
            size: 300,
            footer: () => "รวมทั้งหมด",
        },
        ...numericKeys.map((key) => ({
            header: columnHeaderMap[key] || key,
            accessorKey: key,
            size: 70,
            cell: ({ getValue }) => getValue().toLocaleString(),
            footer: (info) => {
                const total = info.table
                    .getRowModel()
                    .rows.reduce(
                        (sum, row) => sum + (Number(row.getValue(key)) || 0),
                        0
                    );
                return total.toLocaleString();
            },
        })),
    ];

    return {
        columns,
        data: finalData,
    };
}