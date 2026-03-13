```dos
/* 版本一：全局换行补丁 */
.listLabels {
    white-space: normal !important;
    flex-wrap: wrap !important;
    display: flex !important;
}

.Label, .LabelName, .LabelTime {
    margin-bottom: 4px !important; /* 给换行后的标签留一点上下间距 */
}

```
```dos
/* 版本二：智能换行补丁（推荐） */
.listLabels {
    white-space: normal !important;
    flex-wrap: wrap !important;
    display: flex !important;
}

/* 强制日期作为一个整体，不允许内部折断 */
.LabelTime {
    white-space: nowrap !important;
    display: inline-block !important;
}

.Label, .LabelName, .LabelTime {
    margin-bottom: 4px !important;
}

```