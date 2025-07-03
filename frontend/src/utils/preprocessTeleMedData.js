// utils/preprocessTeleMedData.js

export function preprocessTeleMedData(baseData, apiTotals, date) {
    // สร้าง Map เพื่อให้เข้าถึงข้อมูล baseData ได้ง่ายและรวดเร็วด้วย HOSPCODE_HOSNAME
    const baseDataMap = new Map();
    baseData.forEach(item => {
        const hospcodeHosname = `${item.HOSPCODE || ''} ${item.hosname || ''}`.trim();
        baseDataMap.set(hospcodeHosname, item);
    });

    let currentMonth = null;
    let currentYear = null;
    let currentDay = null; // เพิ่มตัวแปรสำหรับวัน

    // --- Logic เพิ่มเติม: แปลง date จาก String ภาษาไทย เป็น Date Object ที่ถูกต้อง ---
    if (date) {
        // Map สำหรับแปลงชื่อเดือนไทยเป็นเลขเดือน (0-indexed)
        const thaiMonthMap = {
            'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3, 'พฤษภาคม': 4, 'มิถุนายน': 5,
            'กรกฎาคม': 6, 'สิงหาคม': 7, 'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11
        };

        const parts = date.split(' '); // แยกสตริงด้วยช่องว่าง
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const monthName = parts[1];
            // แปลงปี พ.ศ. เป็น ค.ศ.
            const buddhistYear = parseInt(parts[2]);
            const christianYear = buddhistYear - 543;

            const monthIndex = thaiMonthMap[monthName];

            if (!isNaN(day) && monthIndex !== undefined && !isNaN(christianYear)) {
                const d = new Date(christianYear, monthIndex, day);
                currentMonth = d.getMonth() + 1; // 1-indexed (1 for Jan, ..., 7 for Jul)
                currentYear = d.getFullYear();
                currentDay = d.getDate(); // ดึงวันออกมา
            }
        }
    }

    // Fallback หาก date ไม่ถูกต้องหรือไม่ถูกกำหนด
    if (currentMonth === null || currentYear === null || currentDay === null) {
        const today = new Date();
        currentMonth = today.getMonth() + 1;
        currentYear = today.getFullYear();
        currentDay = today.getDate();
    }
    // -----------------------------------------------------------------------------

    const processedData = apiTotals.map((apiItem) => {
        const hospcodeHosname = apiItem.HOSPCODE_HOSNAME;
        const correctTotalFromApi = parseInt(apiItem.Total) || 0; // Total นี้มาจาก API กระทรวง

        // ดึงข้อมูลที่ตรงกันจาก baseDataMap
        const baseItem = baseDataMap.get(hospcodeHosname);

        // ดึงค่าบริการรายเดือนจาก baseData ถ้ามี ถ้าไม่มี ให้เป็น 0 (ใช้ _base เพื่อความชัดเจน)
        const total_october = baseItem ? (parseInt(baseItem.total_october) || 0) : 0;
        const total_november = baseItem ? (parseInt(baseItem.total_november) || 0) : 0;
        const total_december = baseItem ? (parseInt(baseItem.total_december) || 0) : 0;
        const total_january = baseItem ? (parseInt(baseItem.total_january) || 0) : 0;
        const total_february = baseItem ? (parseInt(baseItem.total_february) || 0) : 0;

        // ดึงค่าเดือนมีนาคม - กันยายนจาก baseData (สำหรับใช้ในกรณีที่ไม่ใช่เดือนปัจจุบันที่ถูกอัปเดต)
        let total_march_base = baseItem ? (parseInt(baseItem.total_march) || 0) : 0;
        let total_april_base = baseItem ? (parseInt(baseItem.total_april) || 0) : 0;
        let total_may_base = baseItem ? (parseInt(baseItem.total_may) || 0) : 0;
        let total_june_base = baseItem ? (parseInt(baseItem.total_june) || 0) : 0;
        let total_july_base = baseItem ? (parseInt(baseItem.july || baseItem.total_july) || 0) : 0;
        let total_august_base = baseItem ? (parseInt(baseItem.total_august) || 0) : 0;
        let total_september_base = baseItem ? (parseInt(baseItem.total_september) || 0) : 0;

        // คำนวณผลรวมของเดือนที่มีข้อมูลจริงจาก baseData (ต.ค. - ก.พ.)
        const sumOfKnownPreviousMonths =
            total_october +
            total_november +
            total_december +
            total_january +
            total_february;

        // ยอดส่วนต่างที่ต้องนำไปปันส่วน
        const remainingTotalToDistribute = Math.max(0, correctTotalFromApi - sumOfKnownPreviousMonths);

        // กำหนดค่าเริ่มต้นของเดือนทั้งหมดตาม baseData ก่อน (ถ้าไม่มีข้อมูลก็จะเริ่มจาก 0)
        let final_total_march = total_march_base;
        let final_total_april = total_april_base;
        let final_total_may = total_may_base;
        let final_total_june = total_june_base;
        let final_total_july = total_july_base;
        let final_total_august = total_august_base;
        let final_total_september = total_september_base;

        // Logic การปันส่วนยอดที่เพิ่มขึ้นตามเดือนปัจจุบัน (currentMonth) และวัน (currentDay)
        // **ปรับแก้ให้ยอดส่วนต่างไปลงที่ final_total_march เสมอ หากเป็นเดือน มี.ค. - ก.ย.**
        if (currentMonth >= 3 && currentMonth <= 9) { // ครอบคลุม มี.ค. ถึง ก.ย.
            final_total_march = remainingTotalToDistribute; // ให้ยอดทั้งหมดไปลงที่ มี.ค.
            // เดือนอื่นๆ กลับไปใช้ค่า baseData เดิมทั้งหมด
            final_total_april = total_april_base;
            final_total_may = total_may_base;
            final_total_june = total_june_base;
            final_total_july = total_july_base;
            final_total_august = total_august_base;
            final_total_september = total_september_base;
        }
        // หาก currentMonth น้อยกว่า 3 (ก่อน มี.ค.) จะใช้ค่าจาก baseData ทั้งหมด
        // และ remainingTotalToDistribute จะไม่ถูกนำไปใส่ในเดือนใดๆ ในช่วง มี.ค.-ก.ย. ในกรณีนี้

        return {
            HOSPCODE_HOSNAME: hospcodeHosname,
            Total: correctTotalFromApi, // ใช้ Total จาก API กระทรวง
            total_october: total_october,
            total_november: total_november,
            total_december: total_december,
            total_january: total_january,
            total_february: total_february,
            total_march: final_total_march,
            total_april: final_total_april,
            total_may: final_total_may,
            total_june: final_total_june,
            total_july: final_total_july,
            total_august: final_total_august,
            total_september: final_total_september,
        };
    });

    // เรียงลำดับข้อมูลตาม Total ที่ถูกต้อง (จาก API กระทรวง)
    const sortedData = processedData.slice().sort((a, b) => b.Total - a.Total);

    // Console logs สำหรับการดีบั๊ก (สามารถคอมเมนต์ออกได้เมื่อใช้งานจริง)
    // console.log("Processed Data (first 5):", sortedData.slice(0, 5));
    // console.log("Date Prop:", date, "Current Month:", currentMonth, "Current Year:", currentYear, "Current Day:", currentDay);
    // console.log("apiTotals Data Map (sorted by Total, first 5):", apiTotals.slice().sort((a, b) => b.Total - a.Total).slice(0, 5));

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
    // ลบ "total_april", "total_may", "total_june" ออกจากรายการคีย์ที่จะใช้สร้างคอลัมน์
    const numericKeys = [
        "Total",
        "total_october",
        "total_november",
        "total_december",
        "total_january",
        "total_february",
        "total_march",
    ];

    const columnHeaderMap = {
        Total: "จำนวนให้บริการ (ครั้ง)",
        total_october: "ต.ค. 2567",
        total_november: "พ.ย. 2567",
        total_december: "ธ.ค. 2567",
        total_january: "ม.ค. 2568",
        total_february: "ก.พ. 2568",
        total_march: "มี.ค. - มิ.ย. 2568", // Header ยังคงเป็น "มี.ค. - มิ.ย. 2568"
   
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