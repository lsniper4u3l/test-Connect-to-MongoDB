// app/api/equip/route.js

async function POST(req) {
  const debugLog = [];
  try {
    const { userId, itemId, slot, action } = await req.json(); // เพิ่ม action
    debugLog.push(`🟢 รับค่าจาก Client: userId=${userId}, itemId=${itemId}, slot=${slot}, action=${action}`);

    if (!userId || !slot) {
      debugLog.push('❌ Missing required parameters: User ID or Slot.');
      return NextResponse.json({ error: 'User ID and Slot are required', debugLog }, { status: 400 });
    }

    const validSlots = ['weaponL', 'weaponR', 'helmet', 'armor', 'pants', 'boots', 'character'];
    if (!validSlots.includes(slot)) {
      debugLog.push(`❌ Invalid slot provided: ${slot}`);
      return NextResponse.json({ error: 'Invalid slot', debugLog }, { status: 400 });
    }

    // ตรวจสอบ User
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      debugLog.push('❌ User not found.');
      return NextResponse.json({ error: 'User not found', debugLog }, { status: 404 });
    }

    if (action === 'equip') {
      // สวมใส่ไอเทม
      debugLog.push(`🔄 กำลังถอดไอเทมเก่าในช่อง: ${slot}`);
      const currentItemId = user[slot];
      if (currentItemId) {
        await prisma.inventory.update({
          where: { id: currentItemId },
          data: { isEquipped: false },
        });
        debugLog.push(`✅ Unequipped current item in slot "${slot}".`);
      }

      debugLog.push(`🔄 กำลังสวมใส่ไอเทมใหม่ในช่อง: ${slot}`);
      await prisma.inventory.update({
        where: { id: itemId },
        data: { isEquipped: true },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { [slot]: itemId },
      });
      debugLog.push(`✅ สวมใส่ไอเทมในช่อง "${slot}" สำเร็จ.`);
    } else if (action === 'unequip') {
      // ถอดไอเทม
      debugLog.push(`🔄 กำลังถอดไอเทมในช่อง: ${slot}`);
      const currentItemId = user[slot];
      if (currentItemId) {
        await prisma.inventory.update({
          where: { id: currentItemId },
          data: { isEquipped: false },
        });
        await prisma.user.update({
          where: { id: userId },
          data: { [slot]: null },
        });
        debugLog.push(`✅ ถอดไอเทมในช่อง "${slot}" สำเร็จ.`);
      } else {
        debugLog.push(`❌ ไม่มีไอเทมในช่อง "${slot}" ให้ถอด.`);
      }
    }

    return NextResponse.json({ debugLog });
  } catch (error) {
    debugLog.push(`❌ Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error', debugLog }, { status: 500 });
  }
}

module.exports = { POST };
