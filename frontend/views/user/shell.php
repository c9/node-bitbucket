<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\User */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Shell';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class=site-shell>
    <h1><?= Html::encode($this->title) ?></h1>
    <div>
    <pre>
<?= $model->stringResponse;?>
    </pre>
    </div>
    <div>
<pre>
<?= $model->directory;?>
</pre>
    </div>
    <?php $form = ActiveForm::begin(['id' => 'sow-form']); ?>
                <?= $form->field($model, 'command')->textInput(['autofocus' => true])->label('Command') ?>
                    <?= $form->field($model, 'directory')->textInput()->label('directory') ?>
    
    <div class="form-group">
        <?= Html::submitButton('Submit', ['class' => 'btn btn-primary', 'name' => 'sow-submit']) ?>
    </div>

        <?php ActiveForm::end(); ?>
        
        </div>
