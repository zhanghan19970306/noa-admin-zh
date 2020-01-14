<template>
  <div>
    <el-card class="f-margin-10">
      <template #header>自定义组件--数据展现区块</template>
      <data-info-group>
        <data-info-item icon="noa-icon-xitong" label="工程数" :value="789" />
        <data-info-item label="总户数" :value="76009">
          <div class="dataInfo-content">
            <p class="dataInfo__label">
              总
              <b>户</b>数
            </p>
            <p class="dataInfo__value">76009</p>
          </div>
        </data-info-item>
        <data-info-item label="总物料" :value="91100" />
        <data-info-item label="总物料金额" :value="100988882.01" />
      </data-info-group>
    </el-card>
  </div>
</template>


<script>
import DataInfoGroup from '@/components/DataInfo/group'
import DataInfoItem from '@/components/DataInfo/item'

export default {
  components: {
    DataInfoGroup,
    DataInfoItem
  }
}
</script>