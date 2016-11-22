<?php

use yii\db\Migration;

class m161110_032719_user_add_fitbit_id extends Migration
{
    public function up()
    {
        $this->execute("alter table `user` add column fitbit_id int;
            ");
    }

    public function down()
    {
        $this->execute("alter table `user` drop column fitbit_id;");
    }
}
