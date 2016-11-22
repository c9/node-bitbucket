<?php

use yii\db\Migration;

class m160816_212445_sow extends Migration
{
    public function up()
    {
        $this->execute("CREATE TABLE `sow` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `description` text,
          `title` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
          `phone` varchar(255) COLLATE utf8_unicode_ci NULL,
          `email` varchar(255) COLLATE utf8_unicode_ci NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
    }

    public function down()
    {
        $this->execute('drop table sow');
    }
}
