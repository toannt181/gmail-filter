const mail = `le.van.giangb@framgia.com
nguyen.quoc.anh@framgia.com
le.quang.son@framgia.com
nguyen.duy.khanhc@framgia.com
nguyen.minh.nhatb@framgia.com
banh.huu.nguyen@framgia.com
pham.sy.tung@framgia.com
dinh.tien.thang@framgia.com
le.nam@framgia.com
le.duc.tho@framgia.com
trinh.van.thang@framgia.com
tran.cong.hanh@framgia.com
nguyen.kieu.ngan@framgia.com
nguyen.trong.duy@framgia.com
ho.van.cuong@framgia.com
do.thanh.long@framgia.com
nguyen.van.thang@framgia.com
tran.quoc.y@framgia.com
nguyen.nhu.hai.trieu@framgia.com
tran.thi.bich.hanh@framgia.com
dinh.hiep.sy@framgia.com
ha.huu.tin@framgia.com
nguyen.thi.mai.huong@framgia.com
pham.minh.huong@framgia.com
bui.duc.cuong@framgia.com
bui.gia.thinh@framgia.com
lai.hoang.phuc@framgia.com
nguyen.manh.tung@framgia.com
pham.thi.ngoc.mai@framgia.com
luu.quang.minh@framgia.com
nguyen.huy.cuong@framgia.com
nguyen.thanh.tuanb@framgia.com
nguyen.trong.toan@framgia.com
luu.van.chinh@framgia.com
dinh.long.hai@framgia.com
do.viet.tung@framgia.com
nguyen.van.hoat@framgia.com
le.duc.tho@framgia.com
nguyen.tuan.anhc@framgia.com
nguyen.huu.khuyen@framgia.com
hoang.tuan.anh@framgia.com
nguyen.phuong.thuan@framgia.com
yuji.matsumoto@framgia.com
nguyen.ba.hung@framgia.com`

const t = mail.split(/\r?\n/)
const startCase = require('lodash/startCase')
const camelCase = require('lodash/camelCase')
const u = t.map(item => ({
  mail: item,
  name: startCase(camelCase(
    /^(.+)@.+$/.exec(item)[1].replace(/\./g, ' ')
  ))
}))
const fs = require('fs')
fs.writeFile('frontender.json', JSON.stringify(u), 'utf8', e => {
  console.log(e)
})